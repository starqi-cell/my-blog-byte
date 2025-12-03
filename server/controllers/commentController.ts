import { Request, Response } from 'express';
import { CommentModel } from '../models/Comment.js';

export async function getComments(req: Request, res: Response) {
  try {
    const { articleId } = req.params;
    const comments = await CommentModel.findByArticleId(parseInt(articleId));
    res.json(comments);
  } catch (error) {
    console.error('获取评论列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const { articleId } = req.params;
    const userId = (req as any).user?.userId;
    const { content, parent_id } = req.body;

    if (!content) {
      return res.status(400).json({ message: '评论内容为必填项' });
    }

    const commentId = await CommentModel.create({
      article_id: parseInt(articleId),
      user_id: userId,
      parent_id: parent_id || undefined,
      content,
      status: 'approved', // 直接设为已审核状态
    });

    res.status(201).json({
      message: '评论发表成功',
      id: commentId,
    });
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function approveComment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await CommentModel.updateStatus(parseInt(id), 'approved');

    res.json({ message: '评论审核通过' });
  } catch (error) {
    console.error('审核评论错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await CommentModel.delete(parseInt(id));

    res.json({ message: '评论删除成功' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}
