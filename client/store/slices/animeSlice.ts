import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Anime, AnimeListParams, AnimeStats } from '@shared/types';
import AppRequest from '@/service/request';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface AnimeState {
  list: Anime[];
  currentAnime: Anime | null;
  stats: AnimeStats | null;
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filters: {
    keyword: string;
    animeClass?: 'TV' | 'FILM' | 'OVA' | 'ONA';
    country?: string;
    tags?: string;
    sortBy: 'air_date' | 'watch_date' | 'rating' | 'my_rating' | 'created_at';
    sortOrder: 'ASC' | 'DESC';
  };
}

const initialState: AnimeState = {
  list: [],
  currentAnime: null,
  stats: null,
  total: 0,
  page: 1,
  pageSize: 20,
  loading: false,
  error: null,
  filters: {
    keyword: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
  },
};

// 获取动漫列表
export const fetchAnimeList = createAsyncThunk(
  'anime/fetchList',
  async (params: AnimeListParams = {}) => {
    const response = await axios.get(`${API_BASE}/anime/list`, { params });
    return response.data.data;
  }
);

// 获取动漫详情
export const fetchAnimeById = createAsyncThunk('anime/fetchById', async (id: number) => {
  const response = await axios.get(`${API_BASE}/anime/${id}`);
  return response.data.data;
});

// 获取统计信息
export const fetchAnimeStats = createAsyncThunk('anime/fetchStats', async () => {
  const response = await axios.get(`${API_BASE}/anime/stats`);
  return response.data.data;
});

// 从 Bangumi 爬取数据
export const crawlFromBangumi = createAsyncThunk(
  'anime/crawl',
  async (url: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE}/anime/crawl`,
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '爬取失败');
    }
  }
);

// 创建动漫
export const createAnime = createAsyncThunk(
  'anime/create',
  async (data: Partial<Anime>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE}/anime`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '创建失败');
    }
  }
);

// 更新动漫
export const updateAnime = createAsyncThunk(
  'anime/update',
  async ({ id, data }: { id: number; data: Partial<Anime> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE}/anime/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '更新失败');
    }
  }
);

// 删除动漫
export const deleteAnime = createAsyncThunk(
  'anime/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/anime/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '删除失败');
    }
  }
);

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AnimeState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearCurrentAnime: (state) => {
      state.currentAnime = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取列表
    builder.addCase(fetchAnimeList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnimeList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload.list;
      state.total = action.payload.pagination.total;
      state.page = action.payload.pagination.page;
      state.pageSize = action.payload.pagination.pageSize;
    });
    builder.addCase(fetchAnimeList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '获取列表失败';
    });

    // 获取详情
    builder.addCase(fetchAnimeById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnimeById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentAnime = action.payload;
    });
    builder.addCase(fetchAnimeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || '获取详情失败';
    });

    // 获取统计
    builder.addCase(fetchAnimeStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });

    // 爬取数据
    builder.addCase(crawlFromBangumi.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(crawlFromBangumi.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(crawlFromBangumi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 创建
    builder.addCase(createAnime.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createAnime.fulfilled, (state, action) => {
      state.loading = false;
      state.list.unshift(action.payload);
      state.total += 1;
    });
    builder.addCase(createAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 更新
    builder.addCase(updateAnime.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAnime.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.list.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      if (state.currentAnime?.id === action.payload.id) {
        state.currentAnime = action.payload;
      }
    });
    builder.addCase(updateAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // 删除
    builder.addCase(deleteAnime.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAnime.fulfilled, (state, action) => {
      state.loading = false;
      state.list = state.list.filter((item) => item.id !== action.payload);
      state.total -= 1;
    });
    builder.addCase(deleteAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setFilters, setPage, clearCurrentAnime, clearError } = animeSlice.actions;
export default animeSlice.reducer;
