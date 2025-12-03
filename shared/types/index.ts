export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  cover_image?: string;
  author_id: number;
  author_name?: string;
  author_avatar?: string;
  status: 'draft' | 'published' | 'deleted';
  view_count: number;
  like_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  user_name?: string;
  user_avatar?: string;
  parent_id?: number;
  content: string;
  status: 'approved' | 'pending' | 'deleted';
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
