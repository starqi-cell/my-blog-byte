import React, { useState } from 'react';
import { Form, Input, Button, message, Empty } from 'antd';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { createComment } from '@/store/slices/commentsSlice';
import CommentItem from '../CommentItem';
import type { Comment } from '@shared/types';

const { TextArea } = Input;

const CommentsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const CommentsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const CommentForm = styled(Form)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CommentsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

interface CommentsProps {
  articleId: number;
  comments: Comment[];
  onCommentAdded?: () => void;
}

const Comments: React.FC<CommentsProps> = ({ articleId, comments, onCommentAdded }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const handleSubmit = async (values: { content: string }) => {
    if (!user) {
      message.warning('请先登录后再评论');
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        createComment({
          articleId,
          content: values.content,
          parent_id: replyToId || undefined,
        })
      ).unwrap();

      form.resetFields();
      setReplyToId(null);
      
      // 立即重新获取评论列表
      if (onCommentAdded) {
        await onCommentAdded();
      }
      
      message.success('评论发表成功');
    } catch (error: any) {
      message.error(error || '评论发表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (commentId: number) => {
    if (!user) {
      message.warning('请先登录后再回复');
      return;
    }
    setReplyToId(commentId);
  };

  return (
    <CommentsContainer>
      <CommentsTitle>评论 ({comments.length})</CommentsTitle>

      <CommentForm form={form} onFinish={handleSubmit as any}>
        <Form.Item name="content" rules={[{ required: true, message: '请输入评论内容' }]}>
          <TextArea
            rows={4}
            placeholder={
              replyToId ? '回复评论...' : user ? '发表你的看法...' : '请先登录后再评论'
            }
            disabled={!user}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={!user}>
            {replyToId ? '回复' : '发表评论'}
          </Button>
          {replyToId && (
            <Button
              type="link"
              onClick={() => setReplyToId(null)}
              style={{ marginLeft: 8 }}
            >
              取消回复
            </Button>
          )}
        </Form.Item>
      </CommentForm>

      <CommentsList>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
          ))
        ) : (
          <Empty description="暂无评论，来发表第一条评论吧！" />
        )}
      </CommentsList>
    </CommentsContainer>
  );
};

export default Comments;
