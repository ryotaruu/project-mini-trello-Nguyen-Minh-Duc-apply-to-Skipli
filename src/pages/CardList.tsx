import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAppSelector } from '../util/reduxHooks';
import { useEffect, useState } from 'react';
import { getBoardFromFirestore, getCardsByBoardUid, getTasksByCardUId } from '../api/firestore.user';
import { useAppDispatch } from '../util/reduxHooks';
import { setBoard, moveTask } from '../store/kanbanSlice';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from '../components/KanbanColumn';
import { KanbanTaskItem } from '../components/KanbanTaskItem';
import type { KanbanTask } from '../store/kanbanSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function CardList() {
    const { boardUid } = useParams();
    const { user } = useUser();
    const dispatch = useAppDispatch();
    const columns = useAppSelector((state) => state.kanban.columns);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
    const [boardTitle, setBoardTitle] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            if (!boardUid || !user?.uid) {
                setLoading(false);
                return;
            }
            try {
                // Get board data
                const board = await getBoardFromFirestore(boardUid);
                if (!board) {
                    console.error('Board not found');
                    return;
                }

                // Set board title
                setBoardTitle(board.name);

                // Get cards for this board
                const cards = await getCardsByBoardUid(boardUid);

                // Always ensure we have the default columns
                const defaultColumns = [
                    { id: crypto.randomUUID(), title: 'New', tasks: [] },
                    { id: crypto.randomUUID(), title: 'In Progress', tasks: [] },
                    { id: crypto.randomUUID(), title: 'Completed', tasks: [] },
                    { id: crypto.randomUUID(), title: 'Cancelled', tasks: [] },
                ];

                if (!cards || cards.length === 0) {
                    // If no cards exist, use default columns
                    dispatch(setBoard({ columns: defaultColumns }));
                    // Save default columns to localStorage
                    localStorage.setItem('columns', JSON.stringify(defaultColumns));
                    return;
                }

                // Convert cards to columns format
                const columns = await Promise.all(
                    cards.map(async (card) => {
                        const tasks = await getTasksByCardUId(card.uid);
                        return {
                            id: card.uid,
                            title: card.title,
                            tasks: tasks.map((task) => ({
                                id: task.uid,
                                content: task.title,
                            })),
                        };
                    })
                );

                // Ensure we have all default columns
                const defaultColumnTitles = ['New', 'In Progress', 'Completed', 'Cancelled'];
                const existingColumnTitles = columns.map(col => col.title);
                // Add any missing default columns
                defaultColumnTitles.forEach(title => {
                    if (!existingColumnTitles.includes(title)) {
                        columns.push({
                            id: crypto.randomUUID(),
                            title,
                            tasks: []
                        });
                    }
                });

                // Sắp xếp lại columns theo thứ tự chuẩn
                const COLUMN_ORDER = ['New', 'In Progress', 'Completed', 'Cancelled'];
                columns.sort((a, b) => COLUMN_ORDER.indexOf(a.title) - COLUMN_ORDER.indexOf(b.title));

                // Update Redux store
                dispatch(setBoard({ columns }));
                // Save to localStorage as backup
                localStorage.setItem('columns', JSON.stringify(columns));
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [boardUid, user?.uid, dispatch]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);

        // If dragging a task, set the active task
        if (active.data.current?.type === 'task') {
            setActiveTask(active.data.current.task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = columns.findIndex((col) => col.id === active.id);
            const newIndex = columns.findIndex((col) => col.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newColumns = arrayMove(columns, oldIndex, newIndex);
                dispatch(setBoard({ columns: newColumns }));
            }
        }

        setActiveId(null);
        setActiveTask(null);
    };

    const handleDragOver = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'task';
        const isOverTask = over.data.current?.type === 'task';

        if (isActiveTask && isOverTask) {
            // Moving task to another task
            const activeContainer = active.data.current?.parentId;
            const overContainer = over.data.current?.parentId;

            if (activeContainer === overContainer) {
                // Same container
                const activeIndex = columns
                    .find((col) => col.id === activeContainer)
                    ?.tasks.findIndex((task) => task.id === activeId);
                const overIndex = columns
                    .find((col) => col.id === overContainer)
                    ?.tasks.findIndex((task) => task.id === overId);

                if (activeIndex !== undefined && overIndex !== undefined) {
                    const newColumns = [...columns];
                    const container = newColumns.find((col) => col.id === activeContainer);
                    if (container) {
                        container.tasks = arrayMove(container.tasks, activeIndex, overIndex);
                        dispatch(setBoard({ columns: newColumns }));
                    }
                }
            } else {
                // Different containers
                if (boardUid && user?.uid) {
                    dispatch(moveTask({
                        taskId: activeId as string,
                        sourceId: activeContainer as string,
                        destinationId: overContainer as string,
                        boardUid,
                        userId: user.uid
                    }));
                } else {
                    dispatch(moveTask({
                        taskId: activeId as string,
                        sourceId: activeContainer as string,
                        destinationId: overContainer as string
                    }));
                }
            }
        } else if (isActiveTask && !isOverTask) {
            // Moving task to a container
            const activeContainer = active.data.current?.parentId;
            const overContainer = overId;

            if (activeContainer !== overContainer) {
                if (boardUid && user?.uid) {
                    dispatch(moveTask({
                        taskId: activeId as string,
                        sourceId: activeContainer as string,
                        destinationId: overContainer as string,
                        boardUid,
                        userId: user.uid
                    }));
                } else {
                    dispatch(moveTask({
                        taskId: activeId as string,
                        sourceId: activeContainer as string,
                        destinationId: overContainer as string
                    }));
                }
            }
        }
    };

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <ArrowPathIcon className="animate-spin h-8 w-8 text-blue-500" />
    //             <span className="ml-2 text-lg">Loading...</span>
    //         </div>
    //     );
    // }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Cards and Tasks - {boardTitle}
            </h1>
            {loading ? <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div>
                <span className="text-gray-500 text-sm ml-2">Loading your boards, Please wait...</span>
            </div> : <div className='mt-6'>
                <ToastContainer />
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                >
                    <div className="flex gap-4">
                        <SortableContext
                            items={columns.map((column) => column.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {columns.map((column) => (
                                <KanbanColumn
                                    key={column.id}
                                    id={column.id}
                                    title={column.title}
                                    tasks={column.tasks}
                                />
                            ))}
                        </SortableContext>
                    </div>

                    <DragOverlay>
                        {activeId && activeTask ? (
                            <KanbanTaskItem
                                task={activeTask}
                                parentId={columns.find((column) =>
                                    column.tasks.some((task) => task.id === activeTask.id)
                                )?.id || ''}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>}
        </div>
    );
}
