import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Select, Row, Col, Pagination, Spin, Empty } from 'antd';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeList, fetchAnimeStats, setPage } from '../store/slices/animeSlice';
import AnimeCard from '../components/AnimeCard';

const { Search } = Input;
const { Option } = Select;

const AnimeList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, total, page, pageSize, loading, stats } = useAppSelector(
    (state) => state.anime
  );

  const [searchKeyword, setSearchKeyword] = useState('');
  const [animeClassFilter, setAnimeClassFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'air_date' | 'rating' | 'my_rating' | 'created_at'>('created_at');

  useEffect(() => {
    dispatch(fetchAnimeStats());
  }, [dispatch]);

  useEffect(() => {
    loadAnimeList();
  }, [page, searchKeyword, animeClassFilter, countryFilter, sortBy]);

  const loadAnimeList = () => {
    const params: any = {
      page,
      pageSize,
      sortBy,
      sortOrder: 'DESC' as const,
    };

    if (searchKeyword) {
      params.keyword = searchKeyword;
    }

    if (animeClassFilter && animeClassFilter !== 'all') {
      params.animeClass = animeClassFilter;
    }

    if (countryFilter && countryFilter !== 'all') {
      params.country = countryFilter;
    }

    dispatch(fetchAnimeList(params));
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    dispatch(setPage(1));
  };

  const handleClassChange = (value: unknown) => {
    setAnimeClassFilter(value as string);
    dispatch(setPage(1));
  };

  const handleCountryChange = (value: unknown) => {
    setCountryFilter(value as string);
    dispatch(setPage(1));
  };

  const handleSortChange = (value: unknown) => {
    setSortBy(value as 'air_date' | 'rating' | 'my_rating' | 'created_at');
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && list.length === 0) {
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
      <PageTitle>动漫列表</PageTitle>

      {stats && (
        <StatsBar>
          <StatItem>
            <StatLabel>总计:</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>TV:</StatLabel>
            <StatValue>{stats.tvCount}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>剧场版:</StatLabel>
            <StatValue>{stats.filmCount}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>平均评分:</StatLabel>
            <StatValue>{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}</StatValue>
          </StatItem>
        </StatsBar>
      )}

      <FilterBar>
        <StyledSearch
          placeholder="搜索动漫名称、别名..."
          allowClear
          enterButton
          size="large"
          onSearch={handleSearch}
        />

        <StyledSelect
          size="large"
          value={animeClassFilter}
          onChange={handleClassChange}
          placeholder="选择类型"
        >
          <Option value="all">全部类型</Option>
          <Option value="TV">TV</Option>
          <Option value="FILM">剧场版</Option>
          <Option value="OVA">OVA</Option>
          <Option value="ONA">ONA</Option>
        </StyledSelect>

        <StyledSelect
          size="large"
          value={countryFilter}
          onChange={handleCountryChange}
          placeholder="选择国家"
        >
          <Option value="all">全部国家</Option>
          <Option value="日本">日本</Option>
          <Option value="中国">中国</Option>
        </StyledSelect>

        <StyledSelect
          size="large"
          value={sortBy}
          onChange={handleSortChange}
          placeholder="排序方式"
        >
          <Option value="created_at">最新添加</Option>
          <Option value="air_date">首播时间</Option>
          <Option value="rating">媒体评分</Option>
          <Option value="my_rating">我的评分</Option>
        </StyledSelect>
      </FilterBar>

      {loading && list.length === 0 ? (
        <LoadingWrapper>
          <Spin size="large" tip="加载中..." />
        </LoadingWrapper>
      ) : list.length > 0 ? (
        <>
          <Row gutter={[24, 24]}>
            {list.map((anime) => (
              <Col key={anime.id} xs={24} sm={12} md={8} lg={6}>
                <AnimeCard anime={anime} />
              </Col>
            ))}
          </Row>

          {total > pageSize && (
            <PaginationWrapper>
              <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `共 ${total} 部动漫`}
              />
            </PaginationWrapper>
          )}
        </>
      ) : (
        <Empty
          description={
            searchKeyword || animeClassFilter !== 'all' || countryFilter !== 'all'
              ? '没有找到符合条件的动漫'
              : '暂无动漫数据'
          }
          style={{ marginTop: '80px' }}
        />
      )}
    </Container>
  );
};

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

const StatsBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 600;
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

export default AnimeList;
