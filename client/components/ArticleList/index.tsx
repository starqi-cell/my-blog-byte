import React from 'react';
import { List, Pagination, Empty, Spin } from 'antd';
import styled from 'styled-components';
import ArticleCard from '../ArticleCard';
import type { Article } from '@shared/types';

const ListContainer = styled.div`
  min-height: 400px;
`;

const StyledPagination = styled(Pagination)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
  total?: number;
  current?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  loading = false,
  total = 0,
  current = 1,
  pageSize = 10,
  onPageChange,
}) => {
  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" tip="加载中..." />
      </LoadingContainer>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <ListContainer>
        <Empty description="暂无文章" />
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <List
        dataSource={articles}
        renderItem={(article) => <ArticleCard key={article.id} article={article} />}
      />
      {total > pageSize && (
        <StyledPagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
          showTotal={(total) => `共 ${total} 篇文章`}
        />
      )}
    </ListContainer>
  );
};

export default ArticleList;
