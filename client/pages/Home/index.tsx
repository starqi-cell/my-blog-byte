// client/pages/Home/index.tsx
// 主页

import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticles } from '@/store/slices/articlesSlice';
import ArticleList from '@/pages/Home/c-cpns/ArticleList';
import TagCloud from '@/pages/Home/c-cpns/TagCloud';
import { HomeContainer, Sidebar } from './style';
import { useSearchParams } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tagIdParam = searchParams.get('tag');
  const tagId = tagIdParam ? Number(tagIdParam) : undefined;
  useEffect(() => {
    dispatch(fetchArticles({ tagId }));
  }, [tagId]);

  const dispatch = useAppDispatch();
  const { items, total, page, pageSize, loading } = useAppSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchArticles({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    dispatch(fetchArticles({ page: newPage, pageSize: newPageSize }));
  };

  return (
    <HomeContainer>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={17}>
          <ArticleList
            articles={items}
            loading={loading}
            total={total}
            current={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </Col>

        <Col xs={24} lg={7}>
          <Sidebar>
            <TagCloud maxTags={10} selectedTagId={tagId} title="热门标签" />
          </Sidebar>
        </Col>
      </Row>
    </HomeContainer>
  );
};

export default HomePage;
