// client/components/CommentItem/style.ts
// 评论项组件样式文件

import styled from 'styled-components';
import { Button } from 'antd';

export const CommentContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    border-bottom: none;
  }
`;

export const CommentInner = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const CommentContent = styled.div`
  flex: 1;
`;

export const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const AuthorName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export const CommentTime = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const CommentText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

export const CommentActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const ReplyButton = styled(Button)`
  padding: 0;
  height: auto;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const RepliesContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing.xl};
`;