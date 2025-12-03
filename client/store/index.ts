import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import articlesReducer from './slices/articlesSlice.js';
import tagsReducer from './slices/tagsSlice.js';
import commentsReducer from './slices/commentsSlice.js';
import uiReducer from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    tags: tagsReducer,
    comments: commentsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
