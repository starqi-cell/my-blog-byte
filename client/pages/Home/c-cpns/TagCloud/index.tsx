// client/pages/Home/c-cpns/TagCloud/index.tsx
// 标签云组件

import React, { useEffect } from 'react';
import { Space } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTags } from '@/store/slices/tagsSlice';

import { CloudContainer, StyledTag, TagCloudCard } from './style';

interface IProps {
  maxTags?: number;
  title?: string;
  selectedTagId?: number;
}

const TagCloud: React.FC<IProps> = ({ 
  maxTags = 5,
  title = '标签云',
  selectedTagId,
}) => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: tags, loading } = useAppSelector((state) => state.tags as any);

  useEffect(() => {
    dispatch(fetchTags(true)); 
  }, [dispatch]);

  const handleTagClick = (tagId: number, _tagName: string) => {
    if (tagId === selectedTagId) {
      navigate(`/`);
      return;
    }
    navigate(`/?tag=${tagId}`);
  };

  const getTagSize = (articleCount: number, maxCount: number) => {
    if (maxCount === 0) return 14;
    const ratio = articleCount / maxCount;
    return 12 + ratio * 4;
  };

  const tagsWithArticles = tags.filter((tag: any) => (tag.article_count || 0) > 0);

  const maxArticleCount = Math.max(...tagsWithArticles.map((tag: any) => tag.article_count || 0), 1);

  const shuffledTags = [...tagsWithArticles]
    .sort(() => Math.random() - 0.5)
    .slice(0, maxTags);

  if (tagsWithArticles.length === 0) {
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
            $isSelected={tag.id === selectedTagId}
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
