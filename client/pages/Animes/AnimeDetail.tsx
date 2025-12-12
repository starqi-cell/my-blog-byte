import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAnimeById, clearCurrentAnime } from '../../store/slices/animeSlice';
import LazyImage from '../../components/LazyImage';

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentAnime: anime, loading } = useAppSelector((state) => state.anime);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchAnimeById(parseInt(id)));
    }
    return () => {
      dispatch(clearCurrentAnime());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <LoadingWrapper>
        <Spin size="large" tip="加载中..." />
      </LoadingWrapper>
    );
  }

  if (!anime) {
    return (
      <EmptyWrapper>未找到动漫信息</EmptyWrapper>
    );
  }

  const tags = anime.tags ? anime.tags.split(',') : [];
  const castLines = anime.cast ? anime.cast.split('\n') : [];

  return (
    <Container>
        <BackLink to="/anime">← 返回列表</BackLink>

        <Content>
          <CoverSection>
            <CoverWrapper>
              <LazyImage src={anime.cover_url || '/placeholder-anime.jpg'} alt={anime.cn_name} />
            </CoverWrapper>
            {user?.role === 'admin' && (
              <EditLink to={`/admin/anime/${anime.id}/edit`}>✏️ 编辑</EditLink>
            )}
          </CoverSection>

          <InfoSection>
            <Title>{anime.cn_name}</Title>
            {anime.original_title && anime.original_title !== anime.cn_name && (
              <OriginalTitle>{anime.original_title}</OriginalTitle>
            )}

            <InfoGrid>
              <InfoRow>
                <InfoLabel>类型:</InfoLabel>
                <InfoValue>{anime.anime_class}</InfoValue>
              </InfoRow>

              {anime.country && (
                <InfoRow>
                  <InfoLabel>国家/地区:</InfoLabel>
                  <InfoValue>{anime.country}</InfoValue>
                </InfoRow>
              )}

              {anime.air_date && (
                <InfoRow>
                  <InfoLabel>首播日期:</InfoLabel>
                  <InfoValue>{anime.air_date}</InfoValue>
                </InfoRow>
              )}

              {anime.episodes && (
                <InfoRow>
                  <InfoLabel>集数:</InfoLabel>
                  <InfoValue>{anime.episodes}</InfoValue>
                </InfoRow>
              )}

              {anime.studio && (
                <InfoRow>
                  <InfoLabel>制作公司:</InfoLabel>
                  <InfoValue>{anime.studio}</InfoValue>
                </InfoRow>
              )}

              {anime.source && (
                <InfoRow>
                  <InfoLabel>原作来源:</InfoLabel>
                  <InfoValue>{anime.source}</InfoValue>
                </InfoRow>
              )}

              {anime.original_author && (
                <InfoRow>
                  <InfoLabel>原作者:</InfoLabel>
                  <InfoValue>{anime.original_author}</InfoValue>
                </InfoRow>
              )}

              {anime.director && (
                <InfoRow>
                  <InfoLabel>导演:</InfoLabel>
                  <InfoValue>{anime.director}</InfoValue>
                </InfoRow>
              )}

              {anime.writer && (
                <InfoRow>
                  <InfoLabel>编剧:</InfoLabel>
                  <InfoValue>{anime.writer}</InfoValue>
                </InfoRow>
              )}

              {anime.rating && (
                <InfoRow>
                  <InfoLabel>媒体评分:</InfoLabel>
                  <InfoValue>
                    <RatingValue>⭐ {anime.rating.toFixed(1)}</RatingValue>
                  </InfoValue>
                </InfoRow>
              )}

              {anime.my_rating && (
                <InfoRow>
                  <InfoLabel>我的评分:</InfoLabel>
                  <InfoValue>
                    <MyRatingValue>👑 {anime.my_rating.toFixed(1)}</MyRatingValue>
                  </InfoValue>
                </InfoRow>
              )}

              {anime.watch_date && (
                <InfoRow>
                  <InfoLabel>观看时间:</InfoLabel>
                  <InfoValue>{new Date(anime.watch_date).toLocaleDateString()}</InfoValue>
                </InfoRow>
              )}

              {anime.website && (
                <InfoRow>
                  <InfoLabel>官方网站:</InfoLabel>
                  <InfoValue>
                    <ExternalLink href={anime.website} target="_blank" rel="noopener noreferrer">
                      访问官网 →
                    </ExternalLink>
                  </InfoValue>
                </InfoRow>
              )}

              {anime.aliases && (
                <InfoRow>
                  <InfoLabel>别名:</InfoLabel>
                  <InfoValue>{anime.aliases}</InfoValue>
                </InfoRow>
              )}
            </InfoGrid>

            {tags.length > 0 && (
              <Section>
                <SectionTitle>📌 标签</SectionTitle>
                <TagsWrapper>
                  {tags.map((tag, index) => (
                    <Tag key={index}>{tag.trim()}</Tag>
                  ))}
                </TagsWrapper>
              </Section>
            )}

            {anime.plot && (
              <Section>
                <SectionTitle>📝 简介</SectionTitle>
                <Plot>{anime.plot}</Plot>
              </Section>
            )}

            {castLines.length > 0 && (
              <Section>
                <SectionTitle>🎭 角色与声优</SectionTitle>
                <CastList>
                  {castLines.map((line, index) => (
                    <CastItem key={index}>{line}</CastItem>
                  ))}
                </CastList>
              </Section>
            )}
          </InfoSection>
        </Content>
      </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const CoverSection = styled.div`
  @media (max-width: 968px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const CoverWrapper = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

  img {
    width: 100%;
    display: block;
  }
`;

const EditLink = styled(Link)`
  display: block;
  margin-top: 16px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const InfoSection = styled.div``;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.colors.text};
`;

const OriginalTitle = styled.h2`
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 32px 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 32px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoValue = styled.div`
  color: ${({ theme }) => theme.colors.text};
`;

const RatingValue = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.primary};
`;

const MyRatingValue = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: #ff6b6b;
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.colors.text};
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.span`
  padding: 6px 16px;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
`;

const Plot = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
`;

const CastList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CastItem = styled.li`
  padding: 8px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default AnimeDetail;
