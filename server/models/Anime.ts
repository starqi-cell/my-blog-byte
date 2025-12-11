import { RowDataPacket } from 'mysql2';
import { query } from '../utils/database.js';

export interface Anime extends RowDataPacket {
  id: number;
  uid: string;
  cn_name: string;
  original_title?: string;
  aliases?: string;
  cover_url?: string;
  plot?: string;
  tags?: string;
  studio?: string;
  source?: string;
  original_author?: string;
  writer?: string;
  director?: string;
  anime_class: 'TV' | 'FILM' | 'OVA' | 'ONA';
  country?: string;
  air_date?: string;
  episodes?: string;
  rating?: number;
  my_rating?: number;
  watch_date?: Date;
  website?: string;
  cast?: string;
  media_source: 'bangumi';
  created_at: Date;
  updated_at: Date;
}

export interface AnimeListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  animeClass?: 'TV' | 'FILM' | 'OVA' | 'ONA';
  country?: string;
  tags?: string;
  sortBy?: 'air_date' | 'watch_date' | 'rating' | 'my_rating' | 'created_at';
  sortOrder?: 'ASC' | 'DESC';
}

export class AnimeModel {
  static async findById(id: number): Promise<Anime | null> {
    const sql = `SELECT * FROM anime WHERE id = ?`;
    const results = await query<Anime[]>(sql, [id]);
    return results[0] || null;
  }

  static async findByUid(uid: string): Promise<Anime | null> {
    const sql = `SELECT * FROM anime WHERE uid = ?`;
    const results = await query<Anime[]>(sql, [uid]);
    return results[0] || null;
  }

  static async list(params: AnimeListParams): Promise<{ list: Anime[]; total: number }> {
    const {
      page = 1,
      pageSize = 20,
      keyword,
      animeClass,
      country,
      tags,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = params;

    let whereClauses: string[] = [];
    let queryParams: any[] = [];

    if (keyword) {
      whereClauses.push(`(cn_name LIKE ? OR original_title LIKE ? OR aliases LIKE ?)`);
      const searchTerm = `%${keyword}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (animeClass) {
      whereClauses.push('anime_class = ?');
      queryParams.push(animeClass);
    }

    if (country) {
      whereClauses.push('country = ?');
      queryParams.push(country);
    }

    if (tags) {
      whereClauses.push('tags LIKE ?');
      queryParams.push(`%${tags}%`);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // 获取总数
    const countSql = `SELECT COUNT(*) as total FROM anime ${whereClause}`;
    const countResults = await query<Array<{ total: number }>>(countSql, queryParams);
    const total = countResults[0].total;

    // 获取列表
    const offset = (page - 1) * pageSize;
    const listSql = `
      SELECT * FROM anime
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    const list = await query<Anime[]>(listSql, [...queryParams, pageSize, offset]);

    return { list, total };
  }

  static async create(anime: Omit<Anime, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const sql = `
      INSERT INTO anime (
        uid, cn_name, original_title, aliases, cover_url, plot, tags,
        studio, source, original_author, writer, director, anime_class,
        country, air_date, episodes, rating, my_rating, watch_date,
        website, cast, media_source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      anime.uid,
      anime.cn_name,
      anime.original_title || null,
      anime.aliases || null,
      anime.cover_url || null,
      anime.plot || null,
      anime.tags || null,
      anime.studio || null,
      anime.source || null,
      anime.original_author || null,
      anime.writer || null,
      anime.director || null,
      anime.anime_class,
      anime.country || null,
      anime.air_date || null,
      anime.episodes || null,
      anime.rating || null,
      anime.my_rating || null,
      anime.watch_date || null,
      anime.website || null,
      anime.cast || null,
      anime.media_source,
    ];

    const result: any = await query(sql, params);
    return result.insertId;
  }

  static async update(id: number, anime: Partial<Anime>): Promise<boolean> {
    const allowedFields = [
      'cn_name', 'original_title', 'aliases', 'cover_url', 'plot', 'tags',
      'studio', 'source', 'original_author', 'writer', 'director', 'anime_class',
      'country', 'air_date', 'episodes', 'rating', 'my_rating', 'watch_date',
      'website', 'cast'
    ];

    const updates: string[] = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(anime)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) return false;

    params.push(id);
    const sql = `UPDATE anime SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
    const result: any = await query(sql, params);
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM anime WHERE id = ?`;
    const result: any = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  static async getStats(): Promise<{
    total: number;
    tvCount: number;
    filmCount: number;
    avgRating: number;
  }> {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN anime_class = 'TV' THEN 1 ELSE 0 END) as tvCount,
        SUM(CASE WHEN anime_class = 'FILM' THEN 1 ELSE 0 END) as filmCount,
        AVG(CASE WHEN rating IS NOT NULL AND rating > 0 THEN rating ELSE NULL END) as avgRating
      FROM anime
    `;
    const results = await query<any[]>(sql);
    return results[0] || { total: 0, tvCount: 0, filmCount: 0, avgRating: 0 };
  }
}
