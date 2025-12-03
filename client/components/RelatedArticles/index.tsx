import React, { useEffect, useState } from 'react';
import { Card, List, Tag } from 'antd';
import { EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Article } from '@shared/types';



const RecommendCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ArticleItem = styled(List.Item)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.normal};
  padding: ${({ theme }) => theme.spacing.md} !important;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateX(4px);
  }
`;

const ArticleTitle = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

interface RelatedArticlesProps {
  currentArticleId: number;
  currentTags?: Array<{ id: number; name: string; color?: string }>;
  maxCount?: number;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentArticleId,
  currentTags = [],
  maxCount = 5,
}) => {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRelatedArticles();
  }, [currentArticleId, currentTags]);

  const loadRelatedArticles = async () => {
    setLoading(true);
    try {
      // 获取所有文章
      const response = await fetch('http://localhost:4000/api/articles?pageSize=100');
      const data = await response.json();

      if (data.success) {
        const allArticles = data.data.filter((article: Article) => article.id !== currentArticleId);
        
        // 计算相似度分数
        const articlesWithScore = allArticles.map((article: Article) => {
          let score = 0;
          
          // 基于标签的相似度（权重最高）
          if (article.tags && currentTags.length > 0) {
            const articleTagIds = article.tags.map(tag => tag.id);
            const currentTagIds = currentTags.map(tag => tag.id);
            const commonTags = articleTagIds.filter(id => currentTagIds.includes(id));
            score += commonTags.length * 10; // 每个相同标签加10分
          }
          
          // 基于阅读量的热度加分
          score += Math.log(article.view_count + 1) * 0.5;
          
          // 基于点赞数的质量加分
          score += Math.log(article.like_count + 1) * 0.3;
          
          // 时间衰减（越新的文章略微加分）
          const daysSincePublish = (Date.now() - new Date(article.published_at || article.created_at).getTime()) / (1000 * 60 * 60 * 24);
          score += Math.max(0, (30 - daysSincePublish) * 0.1); // 30天内的文章有时间加分
          
          return { ...article, score };
        });

        // 按分数排序，取前N篇
        const sorted = articlesWithScore
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, maxCount);

        setRelatedArticles(sorted);
      }
    } catch (error) {
      console.error('加载相关文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <RecommendCard title="相关推荐" loading={loading}>
      <List
        dataSource={relatedArticles}
        renderItem={(article) => (
          <ArticleItem>
            <div style={{ width: '100%' }}>
              <ArticleTitle to={`/article/${article.id}`}>
                {article.title}
              </ArticleTitle>
              
              {article.tags && article.tags.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {article.tags.slice(0, 3).map((tag) => (
                    <Tag key={tag.id} color={tag.color} style={{ marginBottom: 4 }}>
                      {tag.name}
                    </Tag>
                  ))}
                </div>
              )}
              
              <ArticleMeta>
                <span>
                  <EyeOutlined /> {article.view_count}
                </span>
                <span>
                  <ClockCircleOutlined />{' '}
                  {new Date(article.published_at || article.created_at).toLocaleDateString('zh-CN')}
                </span>
              </ArticleMeta>
            </div>
          </ArticleItem>
        )}
      />
    </RecommendCard>
  );
};

export default RelatedArticles;
