// client/store/slices/commentsSlice.ts
// 评论切片，包含评论相关的状态和异步操作

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Comment } from '@shared/types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface CommentsState {
  items: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk('comments/fetch', async (articleId: number) => {
  const response = await axios.get<Comment[]>(`${API_BASE}/comments/article/${articleId}`);
  return response.data;
});

export const createComment = createAsyncThunk(
  'comments/create',
  async (
    { articleId, content, parent_id }: { articleId: number; content: string; parent_id?: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      const response = await axios.post(
        `${API_BASE}/comments/article/${articleId}`,
        { content, parent_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '发表评论失败');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '获取评论失败';
    });

    builder.addCase(createComment.fulfilled, (state) => {
      // 评论创建后需要重新获取列表
      state.error = null;
    });
  },
});

export const { clearComments, clearError } = commentsSlice.actions;
export default commentsSlice.reducer;
