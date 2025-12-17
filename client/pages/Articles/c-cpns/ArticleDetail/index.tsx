// client/pages/Articles/c-cpns/ArticleDetail/index.tsx
// 文章详情页组件

import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Divider, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCurrentArticle, fetchArticleById } from '@/store/slices/articlesSlice';
import { fetchComments } from '@/store/slices/commentsSlice';

import Comments from '@/components/Comments';
import ArticleContent from "./components/ArticleContent.tsx"; 
import ArticleActionBar from './components/ArticleActionBar.tsx';


import {
  ArticleContainer,
  LoadingContainer,
} from './style';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentArticle: article, loading } = useAppSelector((state) => state.articles);
  const { items: comments } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector(state => state.auth);
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

  const handleCommentAdded = async () => {
    if (id) {

      await new Promise(resolve => setTimeout(resolve, 300));
      await dispatch(fetchComments(parseInt(id))).unwrap();
    }
  };


  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" tip="文章加载中..." />
      </LoadingContainer>
    );
  }

  if (!article) {
    return (
      <LoadingContainer>
        <div>文章不存在或已被删除</div>
        <Button type="link" onClick={() => navigate('/')}>返回首页</Button>
      </LoadingContainer>
    );
  }


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
      
      <ArticleContent ref={contentRef} article={article} />

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
    </ArticleContainer>
  );
};

export default ArticleDetail;