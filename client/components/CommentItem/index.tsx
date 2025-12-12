import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { Comment } from '@shared/types';
import {
  CommentContainer,
  CommentInner,
  CommentContent,
  CommentAuthor,
  AuthorName,
  CommentTime,
  CommentText,
  CommentActions,
  ReplyButton,
  RepliesContainer,
} from './style';


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
