// client/pages/ArticleEditor/index.tsx
// 文章编辑器页面

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Imports from separated files
import { EditorContainer } from './style';
import { useArticleLogic } from './hooks/useArticleLogic';
import EditorMain from './components/EditorMain';
import EditorMeta from './components/EditorMeta';
import { useAppSelector } from '@/store/hooks';

const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  
  const { form, tags, loading, handleSubmit, isEdit } = useArticleLogic(id);

  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    form.setFieldsValue({ content: newContent });
  };
  
  const handleCoverChange = (url: string) => {
    setCoverImageUrl(url);
    form.setFieldsValue({ cover_image: url });
  };



  const handleAIGenerate = async (type: 'content' | 'summary') => {
    const title = form.getFieldValue('title');
    if (type === 'content' && !title) return message.warning('请先输入标题');
    if (type === 'summary' && !content) return message.warning('请先输入内容');

    setAiLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';
      const res = await axios.post(`${API_BASE}/ai/generate`, {
        type,
        input: type === 'content' ? title : content,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const result = res.data.result;
      if (type === 'content') {
        handleContentChange(result);
      } else {
        form.setFieldsValue({ summary: result });
      }
      message.success('AI 生成成功');
    } catch (err: any) {
      message.error(err.response?.data?.message || '生成失败');
    } finally {
      setAiLoading(false);
    }
  };


  return (
    <EditorContainer>
      <h2>{isEdit ? '编辑文章' : '创建文章'}</h2>
      
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input placeholder="输入文章标题" size="large" />
        </Form.Item>

        <EditorMain 
          content={content}
          onContentChange={handleContentChange}
          onAIGenerate={() => handleAIGenerate('content')}
          aiLoading={aiLoading}
        />

        <EditorMeta 
          tags={tags}
          coverImageUrl={coverImageUrl}
          onCoverChange={handleCoverChange}
          onGenerateSummary={() => handleAIGenerate('summary')}
          aiLoading={aiLoading}
        />

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? '更新文章' : '发布文章'}
          </Button>
          <Button onClick={() => navigate('/')} style={{ marginLeft: 8 }} size="large">
            取消
          </Button>
        </Form.Item>
      </Form>

    </EditorContainer>
  );
};

export default ArticleEditor;