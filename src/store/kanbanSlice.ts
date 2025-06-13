import { arrayMove } from '@dnd-kit/sortable';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { saveCardToFirestore, saveTaskToFirestore } from '../api/firestore.user';
import { type Card } from '../types/card';
import { type Task as FirestoreTask } from '../types/task';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDB } from '../features/auth/firebase';

export type KanbanTask = {
  id: string;
  content: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: KanbanTask[];
};

export type Board = {
  columns: Column[];
};

let initialState: Board = {
  columns: [
    { id: 'new', title: 'New', tasks: [] },
    { id: 'in_process', title: 'In Process', tasks: [] },
    { id: 'complete', title: 'Complete', tasks: [] },
    { id: 'cancel', title: 'Cancel', tasks: [] },
  ],
};

const columnsJson = localStorage.getItem('columns');
if (columnsJson) {
  const columns = JSON.parse(columnsJson);
  initialState = { columns };
}

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<{ columns: Column[] }>) => {
      state.columns = action.payload.columns;
    },
    addColumn: (state) => {
      const id = crypto.randomUUID();

      state.columns.push({
        id,
        title: `Column ${state.columns.length + 1}`,
        tasks: [],
      });
    },
    deleteColumn: (state, action: PayloadAction<{ columnId: string; boardUid?: string; userId?: string }>) => {
      const { columnId } = action.payload;
      state.columns = state.columns.filter((column) => column.id !== columnId);
    },
    addTaskToColumnById: (state, action: PayloadAction<{ columnId: string; task: KanbanTask; boardUid?: string; userId?: string }>) => {
      const { columnId, task, boardUid, userId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        // Add task to local state
        column.tasks.push(task);
        
        // If boardUid and userId are provided, save to Firestore
        if (boardUid && userId) {
          // Save task to Firestore
          saveTaskToFirestore({
            uid: task.id,
            title: task.content,
            cardUId: columnId,
            ownerId: userId,
            description: '',
            status: 'new',
            position: column.tasks.length - 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: userId,
            assignedTo: userId,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
          });
        }
      }
    },
    deleteTask: (state, action: PayloadAction<{ taskId: string; parentId: string; boardUid?: string; userId?: string }>) => {
      const { taskId, parentId, boardUid, userId } = action.payload;
      const column = state.columns.find((col) => col.id === parentId);
      if (column) {
        // Remove from local state
        column.tasks = column.tasks.filter((task) => task.id !== taskId);
        
        // If boardUid and userId are provided, delete from Firestore
        if (boardUid && userId) {
          // Update the card in Firestore to remove the task
          const card: Card = {
            uid: parentId,
            boardUid,
            ownerId: userId,
            title: column.title,
            status: column.title.toLowerCase().replace(' ', '_') as Card['status'],
            tasks: column.tasks.map(t => t.id),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
          saveCardToFirestore(card);
        }
      }
    },
    moveColumns: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      state.columns = arrayMove(state.columns, from, to);
    },
    swapItems: (
      state,
      action: PayloadAction<{
        fromId: string;
        toId: string;
        parentId: string;
      }>
    ) => {
      const { fromId, toId, parentId } = action.payload;

      const parentIndex = state.columns.findIndex(
        (column) => column.id === parentId
      );
      const fromIndex = state.columns[parentIndex].tasks.findIndex(
        (task) => task.id === fromId
      );
      const toIndex = state.columns[parentIndex].tasks.findIndex(
        (task) => task.id === toId
      );

      state.columns[parentIndex].tasks = arrayMove(
        state.columns[parentIndex].tasks,
        fromIndex,
        toIndex
      );

      // Update positions in Firestore
      const column = state.columns[parentIndex];
      column.tasks.forEach((task, index) => {
        const taskData: FirestoreTask = {
          uid: task.id,
          cardUId: parentId,
          title: task.content,
          ownerId: '', // This should be passed from the component
          description: '',
          status: column.title.toLowerCase().replace(' ', '_') as FirestoreTask['status'],
          position: index,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: '', // This should be passed from the component
          assignedTo: '', // This should be passed from the component
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'medium'
        };
        saveTaskToFirestore(taskData);
      });
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; sourceId: string; destinationId: string; boardUid?: string; userId?: string }>) => {
      const { taskId, sourceId, destinationId, boardUid, userId } = action.payload;
      const sourceColumn = state.columns.find((col) => col.id === sourceId);
      const destinationColumn = state.columns.find((col) => col.id === destinationId);

      if (sourceColumn && destinationColumn) {
        const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          const [task] = sourceColumn.tasks.splice(taskIndex, 1);
          destinationColumn.tasks.push(task);
          
          // If boardUid and userId are provided, update in Firestore
          if (boardUid && userId) {
            // Update source card
            const sourceCard: Card = {
              uid: sourceId,
              boardUid,
              ownerId: userId,
              title: sourceColumn.title,
              status: sourceId as Card['status'],
              tasks: sourceColumn.tasks.map(t => t.id),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
            saveCardToFirestore(sourceCard);

            // Update destination card
            const destinationCard: Card = {
              uid: destinationId,
              boardUid,
              ownerId: userId,
              title: destinationColumn.title,
              status: destinationId as Card['status'],
              tasks: destinationColumn.tasks.map(t => t.id),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
            saveCardToFirestore(destinationCard);

            // Get existing task data from Firestore to preserve description
            const getExistingTask = async () => {
              try {
                const taskRef = doc(firebaseDB, 'tasks', taskId);
                const taskSnap = await getDoc(taskRef);
                if (taskSnap.exists()) {
                  const existingTask = taskSnap.data() as FirestoreTask;
                  return existingTask;
                }
              } catch (error) {
                console.error('Error getting existing task:', error);
              }
              return null;
            };

            // Update task with preserved description
            getExistingTask().then(existingTask => {
              const taskData: FirestoreTask = {
                uid: task.id,
                cardUId: destinationId,
                title: task.content,
                ownerId: userId,
                description: existingTask?.description || '',
                status: destinationId as FirestoreTask['status'],
                position: destinationColumn.tasks.length - 1,
                createdAt: existingTask?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: existingTask?.createdBy || userId,
                assignedTo: existingTask?.assignedTo || userId,
                dueDate: existingTask?.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                priority: existingTask?.priority || 'medium'
              };
              saveTaskToFirestore(taskData);
            });
          }
        }
      }
    },
    renameColumn: (
      state,
      action: PayloadAction<{ columnId: string; newTitle: string; boardUid: string; userId: string }>
    ) => {
      const { columnId, newTitle, boardUid, userId } = action.payload;

      const column = state.columns.find((column) => column.id === columnId);

      if (!column) return;

      column.title = newTitle;

      // Update card in Firestore
      const card: Card = {
        uid: columnId,
        boardUid,
        ownerId: userId,
        title: newTitle,
        status: newTitle.toLowerCase().replace(' ', '_') as Card['status'],
        tasks: column.tasks.map(task => task.id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      saveCardToFirestore(card);
    },
    renameTask: (state, action: PayloadAction<{ taskId: string; newContent: string; boardUid?: string; userId?: string }>) => {
      const { taskId, newContent, boardUid, userId } = action.payload;
      state.columns.forEach((column) => {
        const task = column.tasks.find((t) => t.id === taskId);
        if (task) {
          task.content = newContent;
          // If boardUid and userId are provided, update in Firestore
          if (boardUid && userId) {
            saveTaskToFirestore({
              uid: task.id,
              title: newContent,
              cardUId: column.id,
              ownerId: userId,
              description: '',
              status: column.title.toLowerCase().replace(' ', '_') as FirestoreTask['status'],
              position: column.tasks.findIndex(t => t.id === taskId),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: userId,
              assignedTo: userId,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              priority: 'medium'
            });
          }
        }
      });
    },
  },
});

export const { 
  setBoard, 
  addColumn, 
  deleteColumn, 
  addTaskToColumnById,
  deleteTask,
  swapItems, 
  moveTask, 
  renameColumn, 
  renameTask 
} = kanbanSlice.actions;

export default kanbanSlice;
