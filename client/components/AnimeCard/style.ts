// client/components/AnimeCard/style.ts
// 动漫卡片组件样式文件

import styled from 'styled-components';
import { Link } from 'react-router-dom';


export const CardContainer = styled(Link)`
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

export const CoverWrapper = styled.div`
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

export const ClassBadge = styled.div`
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

export const RatingBadge = styled.div`
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

export const Star = styled.span`
  font-size: 12px;
`;

export const ContentWrapper = styled.div`
  padding: 16px;
`;

export const Title = styled.h3`
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

export const OriginalTitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

export const MetaItem = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

export const Tag = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.primary};
  padding: 2px 8px;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
`;

export const MyRating = styled.div`
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

export const RatingValue = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.primary};
`;