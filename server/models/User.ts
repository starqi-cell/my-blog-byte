import { RowDataPacket } from 'mysql2';
import { query } from '../utils/database.js';

export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async findById(id: number): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const results = await query<User[]>(sql, [id]);
    return results[0] || null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const results = await query<User[]>(sql, [username]);
    return results[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query<User[]>(sql, [email]);
    return results[0] || null;
  }

  static async create(data: {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    role?: 'admin' | 'user';
  }): Promise<number> {
    const sql = `
      INSERT INTO users (username, email, password, avatar, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result: any = await query(sql, [
      data.username,
      data.email,
      data.password,
      data.avatar || null,
      data.role || 'user',
    ]);
    return result.insertId;
  }

  static async update(
    id: number,
    data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
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
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const result: any = await query(sql, values);
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result: any = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}
