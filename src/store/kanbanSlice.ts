import { arrayMove } from '@dnd-kit/sortable';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getParentIdOfTask } from '../util/kanbanUtils';

export type Task = {
  id: string;
  content: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Board = {
  columns: Column[];
};

let initialState: Board = {
  columns: [
    { id: crypto.randomUUID(), title: 'New', tasks: [] },
    { id: crypto.randomUUID(), title: 'In Progress', tasks: [] },
    { id: crypto.randomUUID(), title: 'Completed', tasks: [] },
    { id: crypto.randomUUID(), title: 'Cancelled', tasks: [] },
  ],
};

const columnsJson = localStorage.getItem('columns');
if (columnsJson) {
  const columns = JSON.parse(columnsJson);
  initialState = { columns };
}

const kanbanSlice = createSlice({
  name: 'kanban-slice',
  initialState: initialState,
  reducers: {
    addColumn: (state) => {
      const id = crypto.randomUUID();

      state.columns.push({
        id,
        title: `Column ${state.columns.length + 1}`,
        tasks: [],
      });
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      const removeId = action.payload;
      state.columns = state.columns.filter((column) => column.id !== removeId);
    },
    addTaskToColumnById: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      const newTask: Task = {
        content: 'Task new - Please click to edit content',
        id: crypto.randomUUID(),
      };

      const column = state.columns.find((column) => column.id === columnId);
      if (!column) return;
      column.tasks.push(newTask);
    },
    deleteTaskById: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;

      state.columns.forEach((column) => {
        column.tasks = column.tasks.filter((task) => task.id !== taskId);
      });
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
    },
    moveTaskToColumn: (
      state,
      action: PayloadAction<{ taskId: string; columnId: string }>
    ) => {
      const { taskId, columnId } = action.payload;

      const columnIndex = state.columns.findIndex(
        (column) => column.id === columnId
      );
      const taskParentId = getParentIdOfTask(state.columns, taskId);

      const taskParentIndex = state.columns.findIndex(
        (column) => column.id === taskParentId
      );

      const task = state.columns[taskParentIndex].tasks.find(
        (task) => task.id === taskId
      );

      if (!task) return;

      state.columns[taskParentIndex].tasks = state.columns[
        taskParentIndex
      ].tasks.filter((task) => task.id !== taskId);
      state.columns[columnIndex].tasks.push(task);
    },
    renameColumn: (
      state,
      action: PayloadAction<{ columnId: string; newTitle: string }>
    ) => {
      const { columnId, newTitle } = action.payload;

      const column = state.columns.find((column) => column.id === columnId);

      if (!column) return;

      column.title = newTitle;
    },
    renameTask: (
      state,
      action: PayloadAction<{ taskId: string; newContent: string }>
    ) => {
      const { taskId, newContent } = action.payload;

      const parentId = getParentIdOfTask(state.columns, taskId);
      const parentColumn = state.columns.find(
        (column) => column.id === parentId
      );

      if (!parentColumn) return;

      const task = parentColumn.tasks.find((task) => task.id === taskId);
      if (!task) return;

      task.content = newContent;
    },
    setBoard: (state, action: PayloadAction<Board>) => {
      const board = action.payload;
      console.log(board);
      state.columns = board.columns;
    },
  },
});

export const kanbanActions = kanbanSlice.actions;
export default kanbanSlice;
