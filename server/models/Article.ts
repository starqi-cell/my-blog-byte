import { RowDataPacket } from 'mysql2';
import { query } from '../utils/database.js';

export interface Article extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  summary?: string;
  cover_image?: string;
  author_id: number;
  status: 'draft' | 'published' | 'deleted';
  view_count: number;
  like_count: number;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
  // 关联数据
  author_name?: string;
  author_avatar?: string;
  tags?: Array<{ id: number; name: string; color: string }>;
}

export interface ArticleListParams {
  page?: number;
  pageSize?: number;
  status?: 'draft' | 'published' | 'deleted';
  authorId?: number;
  tagId?: number;
  keyword?: string;
  sortBy?: 'created_at' | 'published_at' | 'view_count' | 'like_count';
  sortOrder?: 'ASC' | 'DESC';
}

export class ArticleModel {
  static async findById(id: number): Promise<Article | null> {
    const sql = `
      SELECT a.*, u.username as author_name, u.avatar as author_avatar
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `;
    const results = await query<Article[]>(sql, [id]);
    
    if (results[0]) {
      // 获取标签
      const tags = await this.getArticleTags(id);
      results[0].tags = tags;
    }
    
    return results[0] || null;
  }

  static async getList(params: ArticleListParams = {}): Promise<{
    items: Article[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const {
      page = 1,
      pageSize = 10,
      status = 'published',
      authorId,
      tagId,
      keyword,
      sortBy = 'published_at',
      sortOrder = 'DESC',
    } = params;

    const offset = (page - 1) * pageSize;
    const conditions: string[] = ['a.status = ?'];
    const values: any[] = [status];

    if (authorId) {
      conditions.push('a.author_id = ?');
      values.push(authorId);
    }

    if (tagId) {
      conditions.push('EXISTS (SELECT 1 FROM article_tags at WHERE at.article_id = a.id AND at.tag_id = ?)');
      values.push(tagId);
    }

    if (keyword) {
      conditions.push('(a.title LIKE ? OR a.content LIKE ?)');
      values.push(`%${keyword}%`, `%${keyword}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 查询总数
    const countSql = `
      SELECT COUNT(*) as total
      FROM articles a
      ${whereClause}
    `;
    const countResult = await query<Array<{ total: number }>>(countSql, values);
    const total = countResult[0]?.total || 0;

    // 查询列表
    const listSql = `
      SELECT a.*, u.username as author_name, u.avatar as author_avatar
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ${whereClause}
      ORDER BY a.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    const items = await query<Article[]>(listSql, [...values, pageSize, offset]);

    // 为每篇文章获取标签
    for (const item of items) {
      item.tags = await this.getArticleTags(item.id);
    }

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  static async getArticleTags(articleId: number): Promise<Array<{ id: number; name: string; color: string }>> {
    const sql = `
      SELECT t.id, t.name, t.color
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ?
    `;
    return await query(sql, [articleId]);
  }

  static async create(data: {
    title: string;
    content: string;
    summary?: string;
    cover_image?: string;
    author_id: number;
    status?: 'draft' | 'published';
    published_at?: Date;
  }): Promise<number> {
    const sql = `
      INSERT INTO articles (title, content, summary, cover_image, author_id, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result: any = await query(sql, [
      data.title,
      data.content,
      data.summary || null,
      data.cover_image || null,
      data.author_id,
      data.status || 'draft',
      data.published_at || (data.status === 'published' ? new Date() : null),
    ]);
    return result.insertId;
  }

  static async update(
    id: number,
    data: Partial<Omit<Article, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const sql = `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`;
    const result: any = await query(sql, values);
    return result.affectedRows > 0;
  }

  static async delete(id: number, soft: boolean = true): Promise<boolean> {
    if (soft) {
      return await this.update(id, { status: 'deleted' });
    } else {
      const sql = 'DELETE FROM articles WHERE id = ?';
      const result: any = await query(sql, [id]);
      return result.affectedRows > 0;
    }
  }

  static async incrementViewCount(id: number): Promise<void> {
    const sql = 'UPDATE articles SET view_count = view_count + 1 WHERE id = ?';
    await query(sql, [id]);
  }

  static async incrementLikeCount(id: number): Promise<void> {
    const sql = 'UPDATE articles SET like_count = like_count + 1 WHERE id = ?';
    await query(sql, [id]);
  }

  static async addTags(articleId: number, tagIds: number[]): Promise<void> {
    if (tagIds.length === 0) return;

    const values = tagIds.map(tagId => `(${articleId}, ${tagId})`).join(', ');
    const sql = `INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES ${values}`;
    await query(sql);
  }

  static async addTagsByNames(articleId: number, tagNames: string[]): Promise<void> {
    if (tagNames.length === 0) return;

    const { TagModel } = await import('./Tag.js');
    const tagIds: number[] = [];

    for (const tagName of tagNames) {
      const trimmedName = tagName.trim();
      if (!trimmedName) continue;

      // 查找标签是否存在
      let tag = await TagModel.findByName(trimmedName);
      
      // 如果不存在，创建新标签
      if (!tag) {
        const tagId = await TagModel.create({ name: trimmedName });
        tagIds.push(tagId);
      } else {
        tagIds.push(tag.id);
      }
    }

    // 添加标签关联
    if (tagIds.length > 0) {
      await this.addTags(articleId, tagIds);
    }
  }

  static async removeTags(articleId: number, tagIds?: number[]): Promise<void> {
    if (tagIds && tagIds.length > 0) {
      const placeholders = tagIds.map(() => '?').join(', ');
      const sql = `DELETE FROM article_tags WHERE article_id = ? AND tag_id IN (${placeholders})`;
      await query(sql, [articleId, ...tagIds]);
    } else {
      const sql = 'DELETE FROM article_tags WHERE article_id = ?';
      await query(sql, [articleId]);
    }
  }
}
