// client/pages/Home/c-cpns/ArticleCard/index.tsx
// 文章卡片组件

import React from 'react';
import { Tag, Typography } from 'antd';
import { EyeOutlined, LikeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

import type { Article } from '@shared/types';

import { StyledCard, ArticleTitle, ArticleMeta, MetaItem, ArticleSummary, TagsContainer } from './style';

const { Text } = Typography;



interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
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
      )
      }
      {!article.summary && (
        <ArticleSummary ellipsis={{ rows: 3 }}>
          {article.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
        </ArticleSummary>
      )
      }

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
