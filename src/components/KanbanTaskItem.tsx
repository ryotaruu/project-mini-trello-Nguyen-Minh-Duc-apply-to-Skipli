import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useEditable from '../hooks/useEditable';
import { type KanbanTask, deleteTask, renameTask } from '../store/kanbanSlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useState } from 'react';
import { TaskEditForm } from './TaskEditForm';

interface Props {
    task: KanbanTask;
    parentId: string;
}

export function KanbanTaskItem({ task, parentId }: Props) {
    const dispatch = useDispatch();
    const { boardUid } = useParams();
    const { user } = useUser();
    const [localContent, setLocalContent] = useState(task.content);
    const [showEditForm, setShowEditForm] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task.id,
        data: {
            type: 'task',
            task,
            parentId
        }
    });

    const { isEditable, setIsEditable, handleBlur, handleInputFocus } = useEditable();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const deleteTaskHandler = () => {
        if (boardUid && user?.uid) {
            dispatch(deleteTask({ taskId: task.id, parentId, boardUid, userId: user.uid }));
        } else {
            dispatch(deleteTask({ taskId: task.id, parentId }));
        }
    };

    const handleTaskContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalContent(e.target.value);
    };

    const handleTaskBlur = () => {
        handleBlur();
        // Only update if content is not empty and we have the required IDs
        if (localContent.trim() !== '' && parentId && boardUid && user?.uid) {
            dispatch(renameTask({ 
                taskId: task.id, 
                newContent: localContent, 
                boardUid, 
                userId: user.uid 
            }));
        } else {
            // Reset to original content if validation fails
            setLocalContent(task.content);
        }
    };

    const handleTaskClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditForm(true);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="bg-white p-2 mb-2 rounded shadow cursor-move"
            >
                {isEditable ? (
                    <textarea
                        value={localContent}
                        onChange={handleTaskContentChange}
                        onBlur={handleTaskBlur}
                        onFocus={handleInputFocus}
                        className="w-full p-1 border rounded"
                        autoFocus
                    />
                ) : (
                    <div className="flex justify-between items-center">
                        <span onClick={handleTaskClick} className="flex-1 cursor-pointer">
                            {task.content}
                        </span>
                        <button onClick={deleteTaskHandler} className="text-red-500 hover:text-red-700 ml-2">
                            ×
                        </button>
                    </div>
                )}
            </div>
            {showEditForm && (
                <TaskEditForm
                    task={task}
                    parentId={parentId}
                    onClose={() => setShowEditForm(false)}
                />
            )}
        </>
    );
} 