import { Request, Response } from 'express';
import { AnimeModel, AnimeListParams } from '../models/Anime.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

// 从 Bangumi URL 爬取动漫数据
export const crawlFromBangumi = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: '请提供 Bangumi URL' });
    }

    // 验证 URL 格式 (支持 chii.in, bgm.tv, bangumi.tv, chii.tv)
    const bangumiRegex = /https:\/\/(bgm\.tv|bangumi\.tv|chii\.(tv|in))\/subject\/\d+/;
    if (!bangumiRegex.test(url)) {
      return res.status(400).json({ message: '无效的 Bangumi URL，格式应为: https://chii.in/subject/xxxxx' });
    }

    // 爬取页面数据
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // 提取数据
    const animeData: any = {};

    // 基本信息
    const metaKeywords = $("meta[name='keywords']").attr('content') || '';
    const keywords = metaKeywords.split(',');
    animeData.cn_name = keywords[0]?.trim() || '未知';
    animeData.original_title = keywords[1]?.trim() || animeData.cn_name;

    // 封面
    let coverUrl = $('.infobox a.cover').attr('href') || '';
    if (coverUrl.startsWith('//')) {
      coverUrl = 'https:' + coverUrl;
    }
    animeData.cover_url = coverUrl || null;

    // 简介
    let plot = $("span[property='v:summary']").text().trim();
    if (plot) {
      plot = plot.replace('(展开全部)', '').trim();
      plot = plot.replace(/\s{4}/gm, '\n');
      animeData.plot = plot.split('\n').filter((line: string) => line.trim() !== '').join('\n');
    } else {
      animeData.plot = $('#subject_summary').text().trim() || null;
    }

    // 评分
    animeData.rating = parseFloat($('span[property="v:average"]').text().trim()) || null;

    // 辅助函数:从信息框提取数据
    const getInfoFromLi = (label: string): string | null => {
      const elem = $('#infobox li').filter(function (this: any) {
        return $(this).find('.tip').text().trim() === label;
      }).first();

      if (elem.length) {
        const link = elem.find('a').first();
        if (link.length) {
          return link.text().trim();
        }
        return elem.text().replace(label, '').trim();
      }
      return null;
    };

    animeData.original_author = getInfoFromLi('原作:') || null;
    animeData.director = getInfoFromLi('导演:') || null;
    animeData.writer = getInfoFromLi('脚本:') || null;
    animeData.studio = getInfoFromLi('动画制作:') || null;

    // 集数
    let episode = '0';
    const episodeElem = $('#infobox li').filter(function (this: any) {
      return $(this).find('.tip').text().trim() === '话数:';
    }).first();

    if (episodeElem.length) {
      const tipSpan = episodeElem.find('.tip');
      const nextText = tipSpan.get(0)?.nextSibling;
      if (nextText && nextText.nodeType === 3) {
        episode = (nextText as any).nodeValue.trim();
      } else {
        episode = episodeElem.text().replace(/[^\d]/g, '');
      }
    }

    if (episode === '0' || !episode) {
      animeData.anime_class = 'FILM';
      animeData.episodes = '1话';
    } else {
      animeData.anime_class = 'TV';
      animeData.episodes = episode + '话';
    }

    // 首播日期
    const dateElem = $('#infobox li').filter(function (this: any) {
      return $(this).find('.tip').text().trim() === '放送开始:';
    }).first();

    if (dateElem.length) {
      animeData.air_date = dateElem.text().replace('放送开始:', '').trim();
    } else {
      const yearElem = $('#infobox li').filter(function (this: any) {
        return $(this).find('.tip').text().trim() === '上映年度:';
      }).first();
      if (yearElem.length) {
        animeData.air_date = yearElem.text().replace('上映年度:', '').trim();
      }
    }

    // 标签
    const tags: string[] = [];
    $('.inner a span').each((_i: number, elem: any) => {
      if (_i < 3) {
        tags.push($(elem).text().trim());
      }
    });
    animeData.tags = tags.length > 0 ? tags.join(',') : null;

    // 推断国家和来源
    const allTags: string[] = [];
    $('.inner a span').each((_i: number, elem: any) => {
      allTags.push($(elem).text().trim());
    });

    if (allTags.some(t => t.includes('中国'))) {
      animeData.country = '中国';
    } else if (allTags.some(t => t.includes('日本'))) {
      animeData.country = '日本';
    } else {
      animeData.country = null;
    }

    const srcTag = allTags.find(t => /.+改$/.test(t));
    if (allTags.includes('原创')) {
      animeData.source = '原创';
    } else if (srcTag) {
      let src = srcTag.replace(/改$/, '');
      if (src === '漫') src = '漫画';
      animeData.source = src;
    } else {
      animeData.source = null;
    }

    // 官网
    const websiteLi = $('#infobox li').filter(function (this: any) {
      return $(this).find('.tip').text().trim() === '官方网站:';
    }).first();
    const websiteLink = websiteLi.find('a').first();
    animeData.website = websiteLink.length ? websiteLink.attr('href') : null;

    // 别名
    const aliases: string[] = [];
    $('ul li.sub_section, ul li.sub').each((_i: number, elem: any) => {
      const text = $(elem).text().replace('别名: ', '').trim();
      if (text) aliases.push(text);
    });
    animeData.aliases = aliases.length > 0 ? aliases.join(', ') : (animeData.original_title !== animeData.cn_name ? animeData.original_title : null);

    // 演职员表
    const castList: Array<{ character: string; roleType: string; cv: string }> = [];
    $('#browserItemList .item').each((_i: number, elem: any) => {
      const charName = $(elem).find('.title a').text().trim();
      const cvName = $(elem).find('.badge_actor a').text().trim();
      const roleType = $(elem).find('.badge_job_tip').text().trim();

      if (charName && cvName) {
        castList.push({
          character: charName,
          roleType: roleType || '',
          cv: cvName,
        });
      }
    });
    animeData.cast = castList.length > 0
      ? castList.map(c => `${c.character} (${c.roleType}) cv: ${c.cv}`).join('\n')
      : null;

    // 生成 UID
    animeData.uid = Date.now().toString();
    animeData.media_source = 'bangumi';

    // 检查是否已存在
    const subjectId = url.match(/\/subject\/(\d+)/)?.[1];
    if (subjectId) {
      const existing = await AnimeModel.findByUid(subjectId);
      if (existing) {
        return res.status(400).json({ message: '该动漫已存在' });
      }
      animeData.uid = subjectId;
    }

    res.json({
      success: true,
      data: animeData,
      message: '数据爬取成功',
    });
  } catch (error: any) {
    console.error('爬取 Bangumi 数据失败:', error);
    res.status(500).json({
      message: '爬取数据失败',
      error: error.message,
    });
  }
};

// 创建动漫记录
export const createAnime = async (req: Request, res: Response) => {
  try {
    const animeData = req.body;

    // 验证必填字段
    if (!animeData.cn_name || !animeData.anime_class || !animeData.uid) {
      return res.status(400).json({ message: '缺少必填字段' });
    }

    // 检查 UID 是否已存在
    const existing = await AnimeModel.findByUid(animeData.uid);
    if (existing) {
      return res.status(400).json({ message: '该动漫已存在' });
    }

    const id = await AnimeModel.create(animeData);
    const anime = await AnimeModel.findById(id);

    res.status(201).json({
      success: true,
      data: anime,
      message: '动漫创建成功',
    });
  } catch (error: any) {
    console.error('创建动漫失败:', error);
    res.status(500).json({
      message: '创建动漫失败',
      error: error.message,
    });
  }
};

// 获取动漫列表
export const getAnimeList = async (req: Request, res: Response) => {
  try {
    const params: AnimeListParams = {
      page: parseInt(req.query.page as string) || 1,
      pageSize: parseInt(req.query.pageSize as string) || 20,
      keyword: req.query.keyword as string,
      animeClass: req.query.animeClass as any,
      country: req.query.country as string,
      tags: req.query.tags as string,
      sortBy: (req.query.sortBy as any) || 'created_at',
      sortOrder: (req.query.sortOrder as any) || 'DESC',
    };

    const { list, total } = await AnimeModel.list(params);

    res.json({
      success: true,
      data: {
        list,
        pagination: {
          page: params.page,
          pageSize: params.pageSize,
          total,
          totalPages: Math.ceil(total / params.pageSize!),
        },
      },
    });
  } catch (error: any) {
    console.error('获取动漫列表失败:', error);
    res.status(500).json({
      message: '获取动漫列表失败',
      error: error.message,
    });
  }
};

// 获取动漫详情
export const getAnimeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const anime = await AnimeModel.findById(parseInt(id));

    if (!anime) {
      return res.status(404).json({ message: '动漫不存在' });
    }

    res.json({
      success: true,
      data: anime,
    });
  } catch (error: any) {
    console.error('获取动漫详情失败:', error);
    res.status(500).json({
      message: '获取动漫详情失败',
      error: error.message,
    });
  }
};

// 更新动漫
export const updateAnime = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const success = await AnimeModel.update(parseInt(id), updateData);

    if (!success) {
      return res.status(404).json({ message: '动漫不存在或无更新' });
    }

    const anime = await AnimeModel.findById(parseInt(id));
    res.json({
      success: true,
      data: anime,
      message: '动漫更新成功',
    });
  } catch (error: any) {
    console.error('更新动漫失败:', error);
    res.status(500).json({
      message: '更新动漫失败',
      error: error.message,
    });
  }
};

// 删除动漫
export const deleteAnime = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await AnimeModel.delete(parseInt(id));

    if (!success) {
      return res.status(404).json({ message: '动漫不存在' });
    }

    res.json({
      success: true,
      message: '动漫删除成功',
    });
  } catch (error: any) {
    console.error('删除动漫失败:', error);
    res.status(500).json({
      message: '删除动漫失败',
      error: error.message,
    });
  }
};

// 获取统计信息
export const getAnimeStats = async (_req: Request, res: Response) => {
  try {
    const stats = await AnimeModel.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({
      message: '获取统计信息失败',
      error: error.message,
    });
  }
};
