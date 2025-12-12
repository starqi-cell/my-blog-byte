// client/pages/Articles/c-cpns/ArticleDetail/components/ArticleActionBar.tsx/style.ts
// 文章互动操作栏样式文件

import styled from 'styled-components';


export const ArticleContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const ArticleHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const ArticleTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

export const ArticleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  .anticon {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CoverImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;


export const ArticleActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.xl} 0;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TagsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;