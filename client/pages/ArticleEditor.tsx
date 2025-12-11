import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Card, message } from 'antd';
import { PlusOutlined, RobotOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createArticle, updateArticle, fetchArticleById } from '@/store/slices/articlesSlice';
import { fetchTags } from '@/store/slices/tagsSlice';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import AIAssistant from '@/components/AIAssistant';

const { TextArea } = Input;
const { Option } = Select;

const EditorContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const EditorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const PreviewCard = styled(Card)`
  height: 600px;
  overflow-y: auto;
`;

const AIButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { currentArticle, loading } = useAppSelector((state) => state.articles);
  const { items: tags } = useAppSelector((state) => state.tags);
  const { token } = useAppSelector((state) => state.auth);
  const [content, setContent] = useState('');

  const [aiLoading, setAiLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const isEdit = !!id;

  useEffect(() => {
    dispatch(fetchTags(false));
    if (id) {
      dispatch(fetchArticleById(parseInt(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isEdit && currentArticle) {
      form.setFieldsValue({
        title: currentArticle.title,
        content: currentArticle.content,
        summary: currentArticle.summary,
        cover_image: currentArticle.cover_image,
        status: currentArticle.status,
        tags: currentArticle.tags?.map((t) => t.name),
      });
      setContent(currentArticle.content);
      setCoverImageUrl(currentArticle.cover_image || '');
    }
  }, [currentArticle, isEdit, form]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleOpenAIAssistant = () => {
    // 获取选中文本
    const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        setSelectedText(content.substring(start, end));
      } else {
        setSelectedText('');
      }
    }
    setAiAssistantVisible(true);
  };

  const handleInsertAIContent = (text: string) => {
    const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '\n' + text + '\n' + content.substring(end);
      setContent(newContent);
      form.setFieldsValue({ content: newContent });
    }
  };

  const handleImageUpload = async (file: File, type: 'cover' | 'content') => {
    const formData = new FormData();
    formData.append('image', file);

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      message.error('图片大小不能超过 5MB');
      return false;
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('只支持上传 JPG, PNG, GIF, WEBP 格式的图片');
      return false;
    }

    setUploadLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';
      const response = await axios.post(`${API_BASE}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // 构建完整的图片 URL
        const imageUrl = `http://localhost:4000${response.data.url}`;
        
        if (type === 'cover') {
          setCoverImageUrl(imageUrl);
          form.setFieldsValue({ cover_image: imageUrl });
          message.success('封面图片上传成功');
        } else {
          // 在光标位置插入图片
          const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const markdownImage = `\n![图片](${imageUrl})\n`;
            const newContent = content.substring(0, start) + markdownImage + content.substring(end);
            setContent(newContent);
            form.setFieldsValue({ content: newContent });
          }
          message.success('图片上传成功并已插入');
        }
      } else {
        throw new Error(response.data.message || '上传失败');
      }
    } catch (error: any) {
      console.error('图片上传失败:', error);
      message.error(error.response?.data?.message || '图片上传失败，请重试');
    } finally {
      setUploadLoading(false);
    }
    
    return false; // 阻止默认上传行为
  };

  const handleAIGenerate = async (type: 'content' | 'summary') => {
    const title = form.getFieldValue('title');
    if (!title && type === 'content') {
      message.warning('请先输入文章标题');
      return;
    }

    if (!content && type === 'summary') {
      message.warning('请先输入文章内容');
      return;
    }

    setAiLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';
      const response = await axios.post(
        `${API_BASE}/ai/generate`,
        {
          type,
          input: type === 'content' ? title : content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (type === 'content') {
        setContent(response.data.result);
        form.setFieldsValue({ content: response.data.result });
      } else {
        form.setFieldsValue({ summary: response.data.result });
      }

      message.success('AI 生成成功');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'AI 生成失败');
    } finally {
      setAiLoading(false);
    }
  };

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

  return (
    <EditorContainer>
      <h2>{isEdit ? '编辑文章' : '创建文章'}</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="输入文章标题" size="large" />
        </Form.Item>

        <EditorGrid>
          <div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <AIButton
                type="primary"
                icon={<RobotOutlined />}
                onClick={handleOpenAIAssistant}
              >
                AI 写作助手
              </AIButton>
              <AIButton
                icon={<RobotOutlined />}
                onClick={() => handleAIGenerate('content')}
                loading={aiLoading}
              >
                AI 生成内容
              </AIButton>
              <Upload
                beforeUpload={(file) => {
                  handleImageUpload(file, 'content');
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<PlusOutlined />} loading={uploadLoading}>
                  插入图片
                </Button>
              </Upload>
            </div>
            <Form.Item
              name="content"
              label="内容 (Markdown)"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <TextArea
                rows={20}
                placeholder="输入 Markdown 格式的文章内容"
                onChange={handleContentChange}
              />
            </Form.Item>
          </div>

          <div>
            <p style={{ marginBottom: 16, fontWeight: 600 }}>预览</p>
            <PreviewCard>
              <MarkdownRenderer content={content} />
            </PreviewCard>
          </div>
        </EditorGrid>

        <Form.Item label="摘要">
          <Form.Item name="summary" noStyle>
            <TextArea rows={3} placeholder="文章摘要（选填）" />
          </Form.Item>
          <AIButton
            size="small"
            type="link"
            icon={<RobotOutlined />}
            onClick={() => handleAIGenerate('summary')}
            loading={aiLoading}
            style={{ marginTop: 8 }}
          >
            AI 生成摘要
          </AIButton>
        </Form.Item>

        <Form.Item name="cover_image" label="封面图片">
          <Input 
            placeholder="封面图片 URL（选填）" 
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />
          <Upload
            name="cover"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImageUpload(file, 'cover');
              return false;
            }}
            style={{ marginTop: 8 }}
          >
            {coverImageUrl ? (
              <img src={coverImageUrl} alt="封面" style={{ width: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传封面</div>
              </div>
            )}
          </Upload>
          {uploadLoading && <p style={{ color: '#1890ff', marginTop: 8 }}>上传中...</p>}
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select 
            mode="tags" 
            placeholder="输入标签后按回车添加（可自定义）"
            tokenSeparators={[',']}
            maxTagCount={10}
          >
            {tags.map((tag: any) => (
              <Option key={tag.id} value={tag.name}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="状态" initialValue="draft">
          <Select>
            <Option value="draft">草稿</Option>
            <Option value="published">发布</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {isEdit ? '更新文章' : '发布文章'}
          </Button>
          <Button onClick={() => navigate('/')} style={{ marginLeft: 8 }} size="large">
            取消
          </Button>
        </Form.Item>
      </Form>

      <AIAssistant
        visible={aiAssistantVisible}
        onClose={() => setAiAssistantVisible(false)}
        onInsert={handleInsertAIContent}
        selectedText={selectedText}
        fullContent={content}
      />
    </EditorContainer>
  );
};

export default ArticleEditor;
