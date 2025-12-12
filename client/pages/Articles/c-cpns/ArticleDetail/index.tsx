// 


import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Divider, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

// Hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCurrentArticle, fetchArticleById } from '@/store/slices/articlesSlice';
import { fetchComments } from '@/store/slices/commentsSlice';

// Components
import Comments from '@/components/Comments';
import RelatedArticles from '@/components/RelatedArticles';
import ArticleContent from "./components/ArticleContent.tsx"; 
import ArticleActionBar from './components/ArticleActionBar.tsx';

// Styles
import {
  ArticleContainer,
  LoadingContainer,
} from './style';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux Data
  const { currentArticle: article, loading } = useAppSelector((state) => state.articles);
  const { items: comments } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.auth);

  // Ref: 用于获取文章内容的 DOM 节点，以便生成 PDF
  const contentRef = useRef<HTMLDivElement>(null);

  // 初始化数据
  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(parseInt(id)));
      dispatch(fetchComments(parseInt(id)));
    }
    return () => {
      dispatch(clearCurrentArticle());
    };
  }, [id, dispatch]);

  const handleCommentAdded = async () => {
    if (id) {
      // 简单的防抖延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      await dispatch(fetchComments(parseInt(id))).unwrap();
    }
  };

  // Loading 状态处理
  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" tip="文章加载中..." />
      </LoadingContainer>
    );
  }

  // 文章不存在的处理
  if (!article) {
    return (
      <LoadingContainer>
        <div>文章不存在或已被删除</div>
        <Button type="link" onClick={() => navigate('/')}>返回首页</Button>
      </LoadingContainer>
    );
  }

  // 权限判断：当前用户是否是文章作者
  const canEdit = user && article.author_id === user.id;

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

      {/* 1. 传递 ref 给内容组件进行绑定 */}
      <ArticleContent ref={contentRef} article={article} />

      {/* 2. 传递 ref 给操作栏组件进行读取 (导出PDF时使用) */}
      <ArticleActionBar
        canEdit={!!canEdit}
        contentRef={contentRef}
        article={article}
        id={id}
      />

      <Divider />

      <Comments 
        articleId={parseInt(id!)} 
        comments={comments} 
        onCommentAdded={handleCommentAdded} 
      />

      <RelatedArticles
        currentArticleId={article.id}
        currentTags={article.tags}
        maxCount={5}
      />
    </ArticleContainer>
  );
};

export default ArticleDetail;