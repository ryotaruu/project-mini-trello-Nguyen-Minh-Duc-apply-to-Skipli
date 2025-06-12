import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    MouseSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEffect, useMemo, useState } from 'react'
import { type Column, type Task, kanbanActions } from '../store/kanbanSlice'
import { useAppDispatch, useAppSelector } from '../util/reduxHooks'
import KanbanColumn from '../components/KanbanColumn'
import KanbanTaskItem from '../components/KanbanTaskItem'
import { getParentIdOfTask } from '../util/kanbanUtils'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useParams } from "react-router-dom"
import { getBoardFromFirestore } from '../api/firestore.user'
import { type Board } from '../types/board'

function CardList() {
    const columns = useAppSelector((state) => state.kanban.columns)
    const columnIds = useMemo(
        () => columns.map((column) => column.id),
        [columns]
    )
    const dispatch = useAppDispatch()
    const [activeColumn, setActiveColumn] = useState<Column | null>(null)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const { boardUid } = useParams()
    const [boardByDb, setBoardByDb] = useState<Board | null>(null)

    useEffect(() => {
        localStorage.removeItem('columns')
        dispatch(kanbanActions.setBoard({
            columns: [
                { id: crypto.randomUUID(), title: 'New', tasks: [] },
                { id: crypto.randomUUID(), title: 'In Progress', tasks: [] },
                { id: crypto.randomUUID(), title: 'Completed', tasks: [] },
                { id: crypto.randomUUID(), title: 'Cancelled', tasks: [] },
            ]
        }))
    }, [dispatch])

    useEffect(() => {
        localStorage.setItem('columns', JSON.stringify(columns))
    }, [columns])

    useEffect(() => {
        const getBoardByUid = async () => {
            const board = await getBoardFromFirestore(boardUid as string)
            if (board) {
                setBoardByDb(board)
            }
        }
        getBoardByUid()
    }, [boardUid, dispatch])

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 1,
            },
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current === undefined) return
        const itemType = event.active.data.current.type

        if (itemType === 'column') {
            setActiveColumn(event.active.data.current.column)
            return
        }
        if (itemType === 'task-item') {
            setActiveTask(event.active.data.current.task)
            return
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null)
        setActiveTask(null)

        const { active, over } = event
        if (!over) return
        if (event.active.data.current === undefined) return
        const itemType = event.active.data.current.type

        if (itemType === 'column') {
            const activeIndex = columns.findIndex(
                (column) => column.id === active.id
            )
            const overIndex = columns.findIndex((column) => column.id === over.id)

            dispatch(kanbanActions.moveColumns({ from: activeIndex, to: overIndex }))
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return
        if (active.id === over.id) return

        const isActiveATaskItem = active.data.current?.type === 'task-item'
        if (!isActiveATaskItem) return

        if (over.data.current?.type === 'task-item') {
            const activeParentId = active.data.current?.parentId
            const overParentId = over.data.current?.parentId
            const activeId = active.data.current?.task.id
            const overId = over.data.current?.task.id
            if (activeParentId === overParentId) {
                dispatch(
                    kanbanActions.swapItems({
                        fromId: activeId,
                        toId: overId,
                        parentId: activeParentId,
                    })
                )
            }
            return
        }
        if (over.data.current?.type === 'column') {
            const activeId = active.data.current?.task.id
            const overId = over.data.current?.column.id

            const activeParentId = getParentIdOfTask(columns, activeId)

            if (activeParentId === overId) return

            dispatch(
                kanbanActions.moveTaskToColumn({
                    columnId: overId,
                    taskId: activeId,
                })
            )
        }
    }

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-black mb-8 mt-4">Kanban Board - {boardByDb?.name}</h1>
            <div className="flex flex-row items-start min-w-full gap-3 overflow-x-auto pb-12">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                >
                    <SortableContext
                        items={columnIds}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((column: Column) => (
                            <KanbanColumn key={column.id} column={column} />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeColumn && <KanbanColumn column={activeColumn} />}
                        {activeTask && <KanbanTaskItem task={activeTask} />}
                    </DragOverlay>
                </DndContext>
            </div>
        </DashboardLayout>
    )
}

export default CardList
