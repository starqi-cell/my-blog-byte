// client/pages/ArticleEditor/hooks/useImageUpload.ts
// 图片上传

import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useAppSelector } from '@/store/hooks';

export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAppSelector((state) => state.auth);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) {
      message.error('图片大小不能超过 5MB');
      return null;
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('只支持上传 JPG, PNG, GIF, WEBP 格式的图片');
      return null;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';
      const response = await axios.post(`${API_BASE}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return `http://localhost:4000${response.data.url}`;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('图片上传失败:', error);
      message.error(error.response?.data?.message || '图片上传失败');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading };
};