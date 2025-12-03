import { Request, Response } from 'express';
import { generateWithAI } from '../utils/ai.js';

export async function generateContent(req: Request, res: Response) {
  try {
    const { type, input, language } = req.body;

    if (!type || !input) {
      return res.status(400).json({ message: 'type 和 input 为必填项' });
    }

    if (!['content', 'summary', 'title'].includes(type)) {
      return res.status(400).json({ message: 'type 必须是 content、summary 或 title' });
    }

    const result = await generateWithAI({
      type,
      input,
      language,
    });

    res.json({
      type,
      result,
    });
  } catch (error) {
    console.error('AI 生成错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}
