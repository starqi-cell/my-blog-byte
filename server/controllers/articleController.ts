import { Request, Response } from 'express';
import { ArticleModel } from '../models/Article.js';
import { cacheDel } from '../utils/redis.js';

export async function getArticles(req: Request, res: Response) {
  try {
    const {
      page = '1',
      pageSize = '10',
      status = 'published',
      authorId,
      tagId,
      keyword,
      sortBy = 'published_at',
      sortOrder = 'DESC',
    } = req.query;

    const result = await ArticleModel.getList({
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
      status: status as any,
      authorId: authorId ? parseInt(authorId as string) : undefined,
      tagId: tagId ? parseInt(tagId as string) : undefined,
      keyword: keyword as string,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    });

    res.json(result);
  } catch (error) {
    console.error('获取文章列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function getArticleById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findById(parseInt(id));

    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 增加浏览量
    await ArticleModel.incrementViewCount(parseInt(id));

    res.json(article);
  } catch (error) {
    console.error('获取文章详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function createArticle(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;
    const { title, content, summary, cover_image, status, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容为必填项' });
    }

    const articleId = await ArticleModel.create({
      title,
      content,
      summary,
      cover_image,
      author_id: userId,
      status: status || 'draft',
      published_at: status === 'published' ? new Date() : undefined,
    });

    // 添加标签
    if (tags && Array.isArray(tags) && tags.length > 0) {
      // 检查是否是标签名称数组（字符串）还是标签 ID 数组（数字）
      if (typeof tags[0] === 'string') {
        await ArticleModel.addTagsByNames(articleId, tags);
      } else {
        await ArticleModel.addTags(articleId, tags);
      }
    }

    // 清除相关缓存
    await cacheDel('articles:*');

    res.status(201).json({
      message: '文章创建成功',
      id: articleId,
    });
  } catch (error) {
    console.error('创建文章错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function updateArticle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { title, content, summary, cover_image, status, tags } = req.body;

    const article = await ArticleModel.findById(parseInt(id));
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查权限（只有作者本人或管理员可以编辑）
    if (article.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: '权限不足' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (cover_image !== undefined) updateData.cover_image = cover_image;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published' && !article.published_at) {
        updateData.published_at = new Date();
      }
    }

    await ArticleModel.update(parseInt(id), updateData);

    // 更新标签
    if (tags !== undefined && Array.isArray(tags)) {
      await ArticleModel.removeTags(parseInt(id));
      if (tags.length > 0) {
        // 检查是否是标签名称数组（字符串）还是标签 ID 数组（数字）
        if (typeof tags[0] === 'string') {
          await ArticleModel.addTagsByNames(parseInt(id), tags);
        } else {
          await ArticleModel.addTags(parseInt(id), tags);
        }
      }
    }

    // 清除相关缓存
    await cacheDel('articles:*');
    await cacheDel(`article:${id}:*`);

    res.json({ message: '文章更新成功' });
  } catch (error) {
    console.error('更新文章错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function deleteArticle(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { hard = 'false' } = req.query;
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    const article = await ArticleModel.findById(parseInt(id));
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 检查权限
    if (article.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: '权限不足' });
    }

    const isHardDelete = hard === 'true';
    await ArticleModel.delete(parseInt(id), !isHardDelete);

    // 清除相关缓存
    await cacheDel('articles:*');
    await cacheDel(`article:${id}:*`);

    res.json({ message: '文章删除成功' });
  } catch (error) {
    console.error('删除文章错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function likeArticle(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const article = await ArticleModel.findById(parseInt(id));
    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    await ArticleModel.incrementLikeCount(parseInt(id));

    // 清除相关缓存
    await cacheDel(`article:${id}:*`);

    res.json({ message: '点赞成功' });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}
