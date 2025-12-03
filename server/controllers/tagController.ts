import { Request, Response } from 'express';
import { TagModel } from '../models/Tag.js';

export async function getTags(_req: Request, res: Response) {
  try {
    const tags = await TagModel.findAll();
    res.json(tags);
  } catch (error) {
    console.error('获取标签列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function createTag(req: Request, res: Response) {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: '标签名称为必填项' });
    }

    // 检查标签是否已存在
    const existing = await TagModel.findByName(name);
    if (existing) {
      return res.status(400).json({ message: '标签已存在' });
    }

    const tagId = await TagModel.create({ name, color });

    res.status(201).json({
      message: '标签创建成功',
      id: tagId,
    });
  } catch (error) {
    console.error('创建标签错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function updateTag(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await TagModel.findById(parseInt(id));
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;

    await TagModel.update(parseInt(id), updateData);

    res.json({ message: '标签更新成功' });
  } catch (error) {
    console.error('更新标签错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function deleteTag(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const tag = await TagModel.findById(parseInt(id));
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    await TagModel.delete(parseInt(id));

    res.json({ message: '标签删除成功' });
  } catch (error) {
    console.error('删除标签错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}
