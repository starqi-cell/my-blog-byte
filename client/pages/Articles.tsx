import React, { useEffect, useState } from 'react';
import { Input, Select, Row, Col, Pagination, Spin, Empty } from 'antd';

import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticles } from '@/store/slices/articlesSlice';
import ArticleCard from '@/components/ArticleCard';

const { Search } = Input;
const { Option } = Select;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const StyledSearch = styled(Search)`
  flex: 1;
  min-width: 300px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-width: 100%;
  }
`;

const StyledSelect = styled(Select)`
  min-width: 150px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Articles: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, total } = useAppSelector((state) => state.articles);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    loadArticles();
  }, [currentPage, categoryFilter, sortBy, searchKeyword]);

  const loadArticles = () => {
    const params: any = {
      page: currentPage,
      pageSize: pageSize,
      status: 'published',
    };

    if (searchKeyword) {
      params.keyword = searchKeyword;
    }

    if (categoryFilter && categoryFilter !== 'all') {
      params.category = categoryFilter;
    }

    if (sortBy === 'popular') {
      params.sortBy = 'view_count';
      params.sortOrder = 'DESC';
    } else {
      params.sortBy = 'published_at';
      params.sortOrder = 'DESC';
    }

    dispatch(fetchArticles(params));
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: unknown) => {
    setCategoryFilter(value as string);
    setCurrentPage(1);
  };

  const handleSortChange = (value: unknown) => {
    setSortBy(value as 'latest' | 'popular');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && items.length === 0) {
    return (
      <Container>
        <LoadingWrapper>
          <Spin size="large" tip="加载中..." />
        </LoadingWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>文章列表</PageTitle>

      <FilterBar>
        <StyledSearch
          placeholder="搜索文章标题、内容..."
          allowClear
          enterButton
          size="large"
          onSearch={handleSearch}
        />

        <StyledSelect
          size="large"
          value={categoryFilter}
          onChange={handleCategoryChange}
          placeholder="选择分类"
        >
          <Option value="all">全部分类</Option>
          <Option value="技术">技术</Option>
          <Option value="生活">生活</Option>
          <Option value="思考">思考</Option>
          <Option value="随笔">随笔</Option>
        </StyledSelect>

        <StyledSelect
          size="large"
          value={sortBy}
          onChange={handleSortChange}
          placeholder="排序方式"
        >
          <Option value="latest">最新发布</Option>
          <Option value="popular">最多浏览</Option>
        </StyledSelect>
      </FilterBar>

      {items && items.length > 0 ? (
        <>
          <Row gutter={[24, 24]}>
            {items.map((article) => (
              <Col key={article.id} xs={24} sm={12} lg={8}>
                <ArticleCard article={article} />
              </Col>
            ))}
          </Row>

          {total > pageSize && (
            <PaginationWrapper>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `共 ${total} 篇文章`}
              />
            </PaginationWrapper>
          )}
        </>
      ) : (
        <Empty
          description={
            searchKeyword || categoryFilter !== 'all'
              ? '没有找到符合条件的文章'
              : '暂无文章'
          }
          style={{ marginTop: '80px' }}
        />
      )}
    </Container>
  );
};

export default Articles;
