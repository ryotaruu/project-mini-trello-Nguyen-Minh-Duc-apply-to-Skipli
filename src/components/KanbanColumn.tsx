import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import useEditable from '../hooks/useEditable';
import { type Column } from '../store/kanbanSlice';
import { useAppDispatch } from '../util/reduxHooks';
import { KanbanTaskItem } from './KanbanTaskItem';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { addTaskToColumnById, deleteColumn } from '../store/kanbanSlice';

type Props = {
  id: string;
  title: string;
  tasks: Column['tasks'];
};

export default function KanbanColumn({ id, title, tasks }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'column',
      column: { id, title, tasks },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const taskIds = useMemo(
    () => tasks.map((task) => task.id),
    [tasks]
  );

  const dispatch = useAppDispatch();
  const { boardUid } = useParams();
  const { user } = useUser();

  const { isEditable, setIsEditable, handleBlur, handleKeyDown, handleInputFocus } =
    useEditable();

  const createTaskHandler = () => {
    const taskId = crypto.randomUUID();
    const newTask: Column['tasks'][number] = {
      id: taskId,
      content: 'Task new - Please click to edit content',
    };

    if (boardUid && user?.uid) {
      dispatch(addTaskToColumnById({ columnId: id, task: newTask, boardUid, userId: user.uid }));
    } else {
      dispatch(addTaskToColumnById({ columnId: id, task: newTask }));
    }
  };

  const deleteColumnHandler = () => {
    if (boardUid && user?.uid) {
      dispatch(deleteColumn({ columnId: id, boardUid, userId: user.uid }));
    } else {
      dispatch(deleteColumn({ columnId: id }));
    }
  };

  return (
    <div
      className={`bg-gray-100 dark:bg-gray-800 w-80 rounded-lg p-4 flex flex-col ${
        isDragging ? 'opacity-30' : ''
      }`}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between mb-4">
        {!isEditable && (
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
        )}
        {isEditable && (
          <input
            type="text"
            className="text-lg font-semibold text-gray-800 dark:text-white bg-transparent outline-none"
            defaultValue={title}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleInputFocus}
            autoFocus={true}
          />
        )}
        <button
          onClick={deleteColumnHandler}
          className="p-2 text-lg text-transparent group-hover:text-gray-400 transition-all group/button"
        >
          <RiDeleteBinLine className="group-hover/button:text-gray-200 block transition-all" />
        </button>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <KanbanTaskItem key={task.id} task={task} parentId={id} />
        ))}
      </SortableContext>
      <div className="mt-auto">
        <button
          onClick={createTaskHandler}
          className="flex items-center gap-2 py-2 px-4 text-gray-400 hover:text-white transition"
        >
          <FaPlusCircle />
          <span>Create Task</span>
        </button>
      </div>
    </div>
  );
}
