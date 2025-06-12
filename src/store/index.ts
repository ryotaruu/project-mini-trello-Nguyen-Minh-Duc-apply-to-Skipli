import { configureStore } from '@reduxjs/toolkit';
import kanbanSlice from './kanbanSlice';

export const store = configureStore({
  reducer: {
    kanban: kanbanSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
