import React from 'react';
import { Card, Tag, Space, Typography } from 'antd';
import { EyeOutlined, LikeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Article } from '@shared/types';

const { Text, Paragraph } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transition.normal};
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
    transform: translateY(-4px);
  }

  .ant-card-cover img {
    height: 200px;
    object-fit: cover;
  }
`;

const ArticleTitle = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const MetaItem = styled(Space)`
  .anticon {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ArticleSummary = styled(Paragraph)`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const TagsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <StyledCard
      hoverable
      cover={article.cover_image ? <img alt={article.title} src={article.cover_image} /> : null}
    >
      <ArticleTitle to={`/article/${article.id}`}>{article.title}</ArticleTitle>

      <ArticleMeta>
        <MetaItem>
          <UserOutlined />
          <Text>{article.author_name || '匿名'}</Text>
        </MetaItem>
        <MetaItem>
          <CalendarOutlined />
          <Text>{formattedDate}</Text>
        </MetaItem>
        <MetaItem>
          <EyeOutlined />
          <Text>{article.view_count}</Text>
        </MetaItem>
        <MetaItem>
          <LikeOutlined />
          <Text>{article.like_count}</Text>
        </MetaItem>
      </ArticleMeta>

      {article.summary && (
        <ArticleSummary ellipsis={{ rows: 3 }}>{article.summary}</ArticleSummary>
      )}

      {article.tags && article.tags.length > 0 && (
        <TagsContainer>
          {article.tags.map((tag) => (
            <Tag key={tag.id} color={tag.color}>
              {tag.name}
            </Tag>
          ))}
        </TagsContainer>
      )}
    </StyledCard>
  );
};

export default ArticleCard;
