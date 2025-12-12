// client/components/AnimeCard/index.tsx
// 动漫卡片组件

import React from 'react';
import type { Anime } from '@shared/types';
import LazyImage from '../LazyImage';
import {
  CardContainer,
  CoverWrapper,
  ClassBadge,
  RatingBadge,
  ContentWrapper,
  Title,
  OriginalTitle,
  MetaInfo,
  MetaItem,
  TagsWrapper,
  Tag,
  MyRating,
  RatingValue,
  Star,
} from './style';

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



export default AnimeCard;
