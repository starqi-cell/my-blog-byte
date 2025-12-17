// client/pages/User/Profile/style.ts
// 用户个人资料页面样式

import styled from 'styled-components';
import { Card, Avatar } from 'antd';

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const ProfileHeader = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

export const UserAvatar = styled(Avatar)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const UserName = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ArticleCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }
`;