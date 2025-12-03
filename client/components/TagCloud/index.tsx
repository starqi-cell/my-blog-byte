import React, { useEffect } from 'react';
import { Card, Tag, Space } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTags } from '@/store/slices/tagsSlice';

const TagCloudCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const CloudContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`;

const StyledTag = styled(Tag)<{ $size: number }>`
  cursor: pointer;
  font-size: ${({ $size }) => `${Math.max(12, Math.min(24, $size))}px`};
  padding: ${({ $size }) => `${Math.max(4, Math.min(12, $size / 2))}px ${Math.max(8, Math.min(20, $size))}px`};
  margin: ${({ theme }) => theme.spacing.xs};
  transition: all ${({ theme }) => theme.transition.normal};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
  }
`;

interface TagCloudProps {
  maxTags?: number;
  title?: string;
}

const TagCloud: React.FC<TagCloudProps> = ({ 
  maxTags = 20,
  title = '标签云'
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: tags, loading } = useAppSelector((state) => state.tags as any);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleTagClick = (tagId: number, _tagName: string) => {
    // 跳转到带标签筛选的文章列表
    navigate(`/?tag=${tagId}`);
  };

  // 计算标签大小（基于文章数量）
  const getTagSize = (articleCount: number, maxCount: number) => {
    if (maxCount === 0) return 14;
    // 字体大小范围：12px - 24px
    const ratio = articleCount / maxCount;
    return 12 + ratio * 12;
  };

  // 获取最多文章的标签数量
  const maxArticleCount = Math.max(...tags.map((tag: any) => tag.article_count || 0), 1);

  // 随机打乱标签顺序，增加视觉趣味性
  const shuffledTags = [...tags]
    .sort(() => Math.random() - 0.5)
    .slice(0, maxTags);

  if (tags.length === 0) {
    return null;
  }

  return (
    <TagCloudCard 
      title={
        <Space>
          <TagOutlined />
          {title}
        </Space>
      }
      loading={loading}
    >
      <CloudContainer>
        {shuffledTags.map((tag) => (
          <StyledTag
            key={tag.id}
            color={tag.color}
            $size={getTagSize(tag.article_count || 0, maxArticleCount)}
            onClick={() => handleTagClick(tag.id, tag.name)}
          >
            {tag.name} {tag.article_count ? `(${tag.article_count})` : ''}
          </StyledTag>
        ))}
      </CloudContainer>
    </TagCloudCard>
  );
};

export default TagCloud;
