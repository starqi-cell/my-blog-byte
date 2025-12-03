import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: '无效的认证令牌' });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: '认证失败' });
  }
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: '权限不足' });
  }
  next();
}

// 导出别名以保持兼容性
export const authenticate = authMiddleware;
export const requireAdmin = adminMiddleware;
