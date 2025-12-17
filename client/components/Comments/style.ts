// client/components/Comments/style.ts
// 评论组件样式

import styled from 'styled-components';
import { Form } from 'antd';


export const CommentsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const CommentsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

export const CommentForm = styled(Form)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const CommentsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;