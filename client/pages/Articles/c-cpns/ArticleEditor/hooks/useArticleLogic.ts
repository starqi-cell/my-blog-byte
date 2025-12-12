// client/pages/ArticleEditor/hooks/useArticleLogic.ts
// 文章编辑器逻辑

import { useEffect } from 'react';
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createArticle, updateArticle, fetchArticleById } from '@/store/slices/articlesSlice';
import { fetchTags } from '@/store/slices/tagsSlice';

export const useArticleLogic = (id?: string) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentArticle, loading } = useAppSelector((state) => state.articles);
  const { items: tags } = useAppSelector((state) => state.tags);
  
  const isEdit = !!id;

  // 初始化数据
  useEffect(() => {
    dispatch(fetchTags(false));
    if (id) {
      dispatch(fetchArticleById(parseInt(id)));
    }
  }, [id, dispatch]);

  // 回填表单
  useEffect(() => {
    if (isEdit && currentArticle) {
      form.setFieldsValue({
        ...currentArticle,
        tags: currentArticle.tags?.map((t) => t.name),
      });
    }
  }, [currentArticle, isEdit, form]);

  // 提交处理
  const handleSubmit = async (values: any) => {
    try {
      if (isEdit) {
        await dispatch(updateArticle({ id: parseInt(id!), data: values })).unwrap();
        message.success('文章更新成功');
      } else {
        await dispatch(createArticle(values)).unwrap();
        message.success('文章创建成功');
      }
      navigate('/');
    } catch (error: any) {
      message.error(error || '操作失败');
    }
  };

  return { form, tags, loading, handleSubmit, isEdit };
};