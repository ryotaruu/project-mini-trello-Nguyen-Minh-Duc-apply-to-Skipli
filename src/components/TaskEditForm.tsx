import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { type KanbanTask, renameTask } from '../store/kanbanSlice';
import { saveTaskToFirestore, getTaskFromFirestore } from '../api/firestore.user';
import { type Task as FirestoreTask } from '../types/task';

interface Props {
  task: KanbanTask;
  parentId: string;
  onClose: () => void;
}

export function TaskEditForm({ task, parentId, onClose }: Props) {
  const dispatch = useDispatch();
  const { boardUid } = useParams();
  const { user } = useUser();
  const [formData, setFormData] = useState<Partial<FirestoreTask>>({
    title: task.content,
    description: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    status: 'new'
  });

  useEffect(() => {
    // Load task details from Firestore if available
    const loadTaskDetails = async () => {
      if (boardUid && user?.uid) {
        try {
          const taskData = await getTaskFromFirestore(task.id);
          if (taskData) {
            setFormData({
              title: taskData.title,
              description: taskData.description,
              dueDate: taskData.dueDate,
              priority: taskData.priority,
              status: taskData.status
            });
          }
        } catch (error) {
          console.error('Error loading task details:', error);
        }
      }
    };

    loadTaskDetails();
  }, [task.id, boardUid, user?.uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<FirestoreTask>) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardUid || !user?.uid || !formData.title?.trim()) return;

    // Update task in Redux
    dispatch(renameTask({
      taskId: task.id,
      newContent: formData.title,
      boardUid,
      userId: user.uid
    }));

    // Update task in Firestore
    const taskData: FirestoreTask = {
      uid: task.id,
      cardUId: parentId,
      title: formData.title,
      ownerId: user.uid,
      description: formData.description || '',
      status: formData.status || 'new',
      position: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.uid,
      assignedTo: user.uid,
      dueDate: formData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: formData.priority || 'medium'
    };

    try {
      if (!taskData.cardUId) {
        console.error('Cannot save task: cardUId is undefined');
        return;
      }
      await saveTaskToFirestore(taskData);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="fixed inset-0 shadow border-1 border-black flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate?.split('T')[0]}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 