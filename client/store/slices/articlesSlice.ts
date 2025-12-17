// client/store/slices/articlesSlice.ts
// 文章切片，包含文章相关的状态和异步操作

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Article, PaginatedResponse } from '@shared/types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface ArticlesState {
  items: Article[];
  currentArticle: Article | null;
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  items: [],
  currentArticle: null,
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

export const fetchArticles = createAsyncThunk(
  'articles/fetchList',
  async (
    params: {
      page?: number;
      pageSize?: number;
      status?: string;
      tagId?: number;
      keyword?: string;
    } = {}
  ) => {
    const response = await axios.get<PaginatedResponse<Article>>(`${API_BASE}/articles`, { params });
    return response.data;
  }
);

export const fetchArticleById = createAsyncThunk('articles/fetchById', async (id: number) => {
  const response = await axios.get<Article>(`${API_BASE}/articles/${id}`);
  return response.data;
});

export const createArticle = createAsyncThunk(
  'articles/create',
  async (
    data: {
      title: string;
      content: string;
      summary?: string;
      cover_image?: string;
      status?: string;
      tags?: number[];
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      const response = await axios.post(
        `${API_BASE}/articles`, 
        data, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
     );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '创建文章失败');
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/update',
  async (
    { id, data }: { id: number; data: Partial<Article> },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      const response = await axios.put(`${API_BASE}/articles/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '更新文章失败');
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/delete',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      await axios.delete(`${API_BASE}/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '删除文章失败');
    }
  }
);

export const likeArticle = createAsyncThunk('articles/like', async (id: number) => {
  await axios.post(`${API_BASE}/articles/${id}/like`);

  return id;
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取列表
    builder.addCase(fetchArticles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchArticles.fulfilled, (state, action: PayloadAction<PaginatedResponse<Article>>) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '获取文章列表失败';
    });

    // 通过ID获取
    builder.addCase(fetchArticleById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
      state.loading = false;
      state.currentArticle = action.payload;
    });
    builder.addCase(fetchArticleById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '获取文章详情失败';
    });

    // 删除文章
    builder.addCase(deleteArticle.fulfilled, (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    
    builder.addCase(likeArticle.pending, (state ) => {
      const article = state.currentArticle;
      if (article) {
        article.like_count += 1;
        // 可以加个标记 optimisticLike: true
      }
    });
    builder.addCase(likeArticle.rejected, (state ) => {
      const article = state.currentArticle;
      if (article) {
        article.like_count -= 1; // 回滚
      }
    });
  },
});

export const { clearCurrentArticle, clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
