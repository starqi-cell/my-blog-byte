import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Space, Divider, message, Spin, Dropdown } from 'antd';
import {
  EyeOutlined,
  LikeOutlined,
  LikeFilled,
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticleById, likeArticle, deleteArticle, clearCurrentArticle } from '@/store/slices/articlesSlice';
import { fetchComments } from '@/store/slices/commentsSlice';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Comments from '@/components/Comments';
import RelatedArticles from '@/components/RelatedArticles';
import { exportToPDF, exportToMarkdown, exportToText } from '@/utils/export';

import {
  ArticleContainer,
  ArticleHeader,
  ArticleTitle,
  ArticleMeta,
  MetaItem,
  CoverImage,
  ArticleContent,
  ArticleActions,
  TagsContainer,
  LoadingContainer,
} from './style';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentArticle: article, loading } = useAppSelector((state) => state.articles);
  const { items: comments } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.auth);
  const [liked, setLiked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(parseInt(id)));
      dispatch(fetchComments(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [id, dispatch]);

  const handleLike = async () => {
    if (!id) return;
    try {
      await dispatch(likeArticle(parseInt(id))).unwrap();
      setLiked(true);
      message.success('点赞成功');
    } catch (error) {
      message.error('点赞失败');
    }
  };

  const handleEdit = () => {
    navigate(`/article/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dispatch(deleteArticle(parseInt(id))).unwrap();
      message.success('文章已删除');
      navigate('/');
    } catch (error: any) {
      message.error(error || '删除失败');
    }
  };

  const handleCommentAdded = async () => {
    if (id) {
      await new Promise(resolve => setTimeout(resolve, 300));
      await dispatch(fetchComments(parseInt(id))).unwrap();
    }
  };

  const handleExport = async (type: 'pdf' | 'markdown' | 'text') => {
    if (!article || !contentRef.current) return;
    
    try {
      message.loading({ content: '导出中...', key: 'export' });
      
      switch (type) {
        case 'pdf':
          await exportToPDF(article, contentRef.current);
          break;
        case 'markdown':
          exportToMarkdown(article);
          break;
        case 'text':
          exportToText(article);
          break;
      }
      
      message.success({ content: '导出成功', key: 'export' });
    } catch (error) {
      message.error({ content: '导出失败', key: 'export' });
    }
  };

  const exportMenuItems = [
    {
      key: 'pdf',
      label: '导出为 PDF',
      onClick: () => handleExport('pdf'),
    },
    {
      key: 'markdown',
      label: '导出为 Markdown',
      onClick: () => handleExport('markdown'),
    },
    {
      key: 'text',
      label: '导出为文本',
      onClick: () => handleExport('text'),
    },
  ];

  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" tip="加载中..." />
      </LoadingContainer>
    );
  }

  if (!article) {
    return (
      <ArticleContainer>
        <Card>
          <p>文章不存在</p>
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </Card>
      </ArticleContainer>
    );
  }

  const canEdit = user && (user.id === article.author_id || user.role === 'admin');
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <ArticleContainer>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      <ArticleHeader>
        <ArticleTitle>{article.title}</ArticleTitle>

        <ArticleMeta>
          <MetaItem>
            <UserOutlined />
            {article.author_name || '匿名'}
          </MetaItem>
          <MetaItem>
            <CalendarOutlined />
            {formattedDate}
          </MetaItem>
          <MetaItem>
            <EyeOutlined />
            {article.view_count} 次阅读
          </MetaItem>
          <MetaItem>
            <LikeOutlined />
            {article.like_count} 次点赞
          </MetaItem>
        </ArticleMeta>

        {article.tags && article.tags.length > 0 && (
          <TagsContainer>
            {article.tags.map((tag) => (
              <Tag key={tag.id} color={tag.color}>
                {tag.name}
              </Tag>
            ))}
          </TagsContainer>
        )}
      </ArticleHeader>

      {article.cover_image && <CoverImage src={article.cover_image} alt={article.title} />}

      <ArticleContent ref={contentRef}>
        <MarkdownRenderer content={article.content} />
      </ArticleContent>

      <ArticleActions>
        <Space>
          <Button
            type={liked ? 'primary' : 'default'}
            icon={liked ? <LikeFilled /> : <LikeOutlined />}
            onClick={handleLike}
            disabled={liked}
          >
            {liked ? '已点赞' : '点赞'}
          </Button>
          
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomLeft">
            <Button icon={<DownloadOutlined />}>
              导出
            </Button>
          </Dropdown>
        </Space>

        {canEdit && (
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              删除
            </Button>
          </Space>
        )}
      </ArticleActions>

      <Divider />

      <Comments articleId={parseInt(id!)} comments={comments} onCommentAdded={handleCommentAdded} />
      
      <RelatedArticles 
        currentArticleId={article.id} 
        currentTags={article.tags} 
        maxCount={5}
      />
    </ArticleContainer>
  );
};

export default ArticleDetail;
