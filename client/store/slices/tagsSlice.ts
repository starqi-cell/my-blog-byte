import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Tag } from '@shared/types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface TagsState {
  items: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTags = createAsyncThunk('tags/fetchAll', async () => {
  const response = await axios.get<Tag[]>(`${API_BASE}/tags`);
  return response.data;
});

export const createTag = createAsyncThunk(
  'tags/create',
  async ({ name, color }: { name: string; color?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      const response = await axios.post(
        `${API_BASE}/tags`,
        { name, color },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '创建标签失败');
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '获取标签失败';
    });
  },
});

export const { clearError } = tagsSlice.actions;
export default tagsSlice.reducer;
