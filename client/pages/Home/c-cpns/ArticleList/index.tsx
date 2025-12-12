// client/pages/Home/c-cpns/ArticleList/index.tsx
// 文章列表组件

import React from 'react';
import { List, Empty, Spin } from 'antd';

import type { Article } from '@shared/types';

import ArticleCard from '../../../../components/ArticleCard';
import { LoadingContainer, ListContainer, StyledPagination } from './style';


interface IProps {
  articles: Article[];
  loading?: boolean;
  total?: number;
  current?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

const ArticleList: React.FC<IProps> = ({
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
