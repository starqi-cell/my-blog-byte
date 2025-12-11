import { RowDataPacket } from 'mysql2';
import { query } from '../utils/database.js';

export interface Tag extends RowDataPacket {
  id: number;
  name: string;
  color: string;
  created_at: Date;
  article_count?: number;
}

export class TagModel {
  static async findAll(): Promise<Tag[]> {
    const sql = 'SELECT * FROM tags ORDER BY name ASC';
    return await query<Tag[]>(sql);
  }

  static async findAllWithCount(): Promise<Tag[]> {
    const sql = `
      SELECT 
        t.id,
        t.name,
        t.color,
        t.created_at,
        COUNT(at.article_id) as article_count
      FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id
      LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
      GROUP BY t.id, t.name, t.color, t.created_at
      ORDER BY article_count DESC, t.name ASC
    `;
    return await query<Tag[]>(sql);
  }

  static async findById(id: number): Promise<Tag | null> {
    const sql = 'SELECT * FROM tags WHERE id = ?';
    const results = await query<Tag[]>(sql, [id]);
    return results[0] || null;
  }

  static async findByName(name: string): Promise<Tag | null> {
    const sql = 'SELECT * FROM tags WHERE name = ?';
    const results = await query<Tag[]>(sql, [name]);
    return results[0] || null;
  }

  static async create(data: { name: string; color?: string }): Promise<number> {
    const sql = 'INSERT INTO tags (name, color) VALUES (?, ?)';
    const result: any = await query(sql, [data.name, data.color || '#1890ff']);
    return result.insertId;
  }

  static async update(id: number, data: Partial<Omit<Tag, 'id' | 'created_at'>>): Promise<boolean> {
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
    const sql = `UPDATE tags SET ${fields.join(', ')} WHERE id = ?`;
    const result: any = await query(sql, values);
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM tags WHERE id = ?';
    const result: any = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}
