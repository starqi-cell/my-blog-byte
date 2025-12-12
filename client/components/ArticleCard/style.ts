// client/pages/Home/c-cpns/ArticleCard/style.ts
// 文章卡片样式

import styled from 'styled-components';
import { Card, Space,Typography  } from 'antd';
import { Link } from 'react-router-dom';

const { Paragraph } = Typography;

export const StyledCard = styled(Card)`
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

export const ArticleTitle = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ArticleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const MetaItem = styled(Space)`
  .anticon {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ArticleSummary = styled(Paragraph)`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const TagsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;