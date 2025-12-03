import { RowDataPacket } from 'mysql2';
import { query } from '../utils/database.js';

export interface Comment extends RowDataPacket {
  id: number;
  article_id: number;
  user_id: number;
  parent_id?: number;
  content: string;
  status: 'approved' | 'pending' | 'deleted';
  created_at: Date;
  updated_at: Date;
  // 关联数据
  user_name?: string;
  user_avatar?: string;
  replies?: Comment[];
}

export class CommentModel {
  static async findByArticleId(articleId: number): Promise<Comment[]> {
    const sql = `
      SELECT c.*, u.username as user_name, u.avatar as user_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ? AND c.status = 'approved' AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
    `;
    const comments = await query<Comment[]>(sql, [articleId]);

    // 获取每个评论的回复
    for (const comment of comments) {
      comment.replies = await this.findReplies(comment.id);
    }

    return comments;
  }

  static async findReplies(parentId: number): Promise<Comment[]> {
    const sql = `
      SELECT c.*, u.username as user_name, u.avatar as user_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.parent_id = ? AND c.status = 'approved'
      ORDER BY c.created_at ASC
    `;
    return await query<Comment[]>(sql, [parentId]);
  }

  static async create(data: {
    article_id: number;
    user_id: number;
    parent_id?: number;
    content: string;
    status?: 'approved' | 'pending';
  }): Promise<number> {
    const sql = `
      INSERT INTO comments (article_id, user_id, parent_id, content, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result: any = await query(sql, [
      data.article_id,
      data.user_id,
      data.parent_id || null,
      data.content,
      data.status || 'approved',
    ]);
    return result.insertId;
  }

  static async updateStatus(
    id: number,
    status: 'approved' | 'pending' | 'deleted'
  ): Promise<boolean> {
    const sql = 'UPDATE comments SET status = ? WHERE id = ?';
    const result: any = await query(sql, [status, id]);
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    return await this.updateStatus(id, 'deleted');
  }
}
