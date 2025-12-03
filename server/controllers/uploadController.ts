import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export async function uploadImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }

    // 返回图片访问路径
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: '上传成功',
      url: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('上传图片错误:', error);
    res.status(500).json({ message: '上传失败' });
  }
}

export async function deleteImage(req: Request, res: Response) {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', filename);

    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: '删除成功' });
    } else {
      res.status(404).json({ message: '文件不存在' });
    }
  } catch (error) {
    console.error('删除图片错误:', error);
    res.status(500).json({ message: '删除失败' });
  }
}
