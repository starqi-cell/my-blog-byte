import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Anime } from '@shared/types';
import LazyImage from '../LazyImage';

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const tags = anime.tags ? anime.tags.split(',').slice(0, 3) : [];
  const airYear = anime.air_date ? anime.air_date.match(/\d{4}/)?.[0] : null;

  return (
    <CardContainer to={`/anime/${anime.id}`}>
      <CoverWrapper>
        <LazyImage
          src={anime.cover_url || '/placeholder-anime.jpg'}
          alt={anime.cn_name}
        />
        {anime.anime_class && <ClassBadge>{anime.anime_class}</ClassBadge>}
        {anime.rating && (
          <RatingBadge>
            <Star>⭐</Star>
            <span>{anime.rating.toFixed(1)}</span>
          </RatingBadge>
        )}
      </CoverWrapper>
      
      <ContentWrapper>
        <Title>{anime.cn_name}</Title>
        
        {anime.original_title && anime.original_title !== anime.cn_name && (
          <OriginalTitle>{anime.original_title}</OriginalTitle>
        )}
        
        <MetaInfo>
          {airYear && <MetaItem>📅 {airYear}</MetaItem>}
          {anime.episodes && <MetaItem>📺 {anime.episodes}</MetaItem>}
          {anime.country && <MetaItem>🌏 {anime.country}</MetaItem>}
        </MetaInfo>

        {tags.length > 0 && (
          <TagsWrapper>
            {tags.map((tag, index) => (
              <Tag key={index}>{tag.trim()}</Tag>
            ))}
          </TagsWrapper>
        )}

        {anime.my_rating && (
          <MyRating>
            <span>👑 我的评分:</span>
            <RatingValue>{anime.my_rating.toFixed(1)}</RatingValue>
          </MyRating>
        )}
      </ContentWrapper>
    </CardContainer>
  );
};

const CardContainer = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 140%; /* 5:7 宽高比 */
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ClassBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const RatingBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
`;

const Star = styled.span`
  font-size: 12px;
`;

const ContentWrapper = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OriginalTitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const MetaItem = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

const Tag = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.primary};
  padding: 2px 8px;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
`;

const MyRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  span:first-child {
    font-weight: 500;
  }
`;

const RatingValue = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default AnimeCard;
