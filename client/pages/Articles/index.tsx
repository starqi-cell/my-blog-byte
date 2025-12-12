import React, { useEffect, useState } from 'react';
import { Select, Row, Col, Pagination, Spin, Empty } from 'antd';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticles } from '@/store/slices/articlesSlice';
import { fetchTags } from '@/store/slices/tagsSlice';
import ArticleCard from '@/components/ArticleCard';

import { Container, PageTitle, FilterBar, StyledSearch, StyledSelect, PaginationWrapper, LoadingWrapper } from './style';

const { Option } = Select;



const Articles: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, total } = useAppSelector((state) => state.articles);
  const { items: tags } = useAppSelector((state) => state.tags);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    dispatch(fetchTags(true)); 
  }, [dispatch]);

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
      params.tagId = categoryFilter;
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
          placeholder="搜索"
          allowClear
          enterButton
          size="large"
          onSearch={handleSearch}
        />

        <StyledSelect
          size="large"
          value={categoryFilter}
          onChange={handleCategoryChange}
          placeholder="选择标签"
        >
          <Option value="all">全部标签</Option>
          {tags
            .filter((tag: any) => (tag.article_count || 0) > 0)
            .map((tag: any) => (
              <Option key={tag.id} value={tag.id}>
                {tag.name} ({tag.article_count})
              </Option>
            ))}
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
