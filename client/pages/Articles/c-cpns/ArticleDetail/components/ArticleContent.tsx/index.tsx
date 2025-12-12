// client/pages/Articles/c-cpns/ArticleDetail/components/ArticleContent.tsx
// 文章内容组件

import { memo, forwardRef } from 'react';
import type { ReactNode } from 'react';
import {
  EyeOutlined,
  LikeOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import {
  ArticleHeader,
  ArticleTitle,
  ArticleMeta,
  MetaItem,
  CoverImage,
  ArticleContentWrap,
  TagsContainer,
} from './style'; 
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { Article } from '@shared/types'; 

interface IProps {
  children?: ReactNode;
  article?: Article | null;
}


const ArticleContent = forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { article } = props;

  if (!article) {
    return null;
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <>
      <ArticleHeader>
        <ArticleTitle>{article.title}</ArticleTitle>

        <ArticleMeta>
          <MetaItem>
            <UserOutlined />
            {article.author_name || '匿名'}
          </MetaItem>
          <MetaItem>
            <CalendarOutlined />
            {formattedDate}
          </MetaItem>
          <MetaItem>
            <EyeOutlined />
            {article.view_count} 次阅读
          </MetaItem>
          <MetaItem>
            <LikeOutlined />
            {article.like_count} 次点赞
          </MetaItem>
        </ArticleMeta>

        {article.tags && article.tags.length > 0 && (
          <TagsContainer>
            {article.tags.map((tag) => (
              <Tag key={tag.id} color={tag.color}>
                {tag.name}
              </Tag>
            ))}
          </TagsContainer>
        )}
      </ArticleHeader>

      {article.cover_image && (
        <CoverImage src={article.cover_image} alt={article.title} />
      )}

      <ArticleContentWrap ref={ref}>
        <MarkdownRenderer content={article.content} />
      </ArticleContentWrap>
    </>
  );
});

export default memo(ArticleContent);