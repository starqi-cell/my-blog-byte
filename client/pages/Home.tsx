import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticles } from '@/store/slices/articlesSlice';
import ArticleList from '@/components/ArticleList';
import TagCloud from '@/components/TagCloud';

const HomeContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const Sidebar = styled.div`
  position: sticky;
  top: 80px;
`;

const HomePage: React.FC = () => {
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
            <TagCloud maxTags={20} title="热门标签" />
          </Sidebar>
        </Col>
      </Row>
    </HomeContainer>
  );
};

export default HomePage;
