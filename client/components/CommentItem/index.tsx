import React from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { Comment } from '@shared/types';

const CommentContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    border-bottom: none;
  }
`;

const CommentInner = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AuthorName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const CommentTime = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const CommentText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const CommentActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ReplyButton = styled(Button)`
  padding: 0;
  height: auto;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const RepliesContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing.xl};
`;

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
  const formattedDate = new Date(comment.created_at).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <CommentContainer>
      <CommentInner>
        <Avatar
          src={comment.user_avatar}
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1890ff' }}
        />
        <CommentContent>
          <CommentAuthor>
            <AuthorName>{comment.user_name || '匿名用户'}</AuthorName>
            <CommentTime>{formattedDate}</CommentTime>
          </CommentAuthor>
          <CommentText>{comment.content}</CommentText>
          {onReply && (
            <CommentActions>
              <ReplyButton type="link" onClick={() => onReply(comment.id)}>
                回复
              </ReplyButton>
            </CommentActions>
          )}
        </CommentContent>
      </CommentInner>
      {comment.replies && comment.replies.length > 0 && (
        <RepliesContainer>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </RepliesContainer>
      )}
    </CommentContainer>
  );
};

export default CommentItem;
