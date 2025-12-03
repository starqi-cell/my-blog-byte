import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password, avatar } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({ message: '用户名、邮箱和密码为必填项' });
    }

    // 检查用户名是否已存在
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 检查邮箱是否已存在
    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: '邮箱已被使用' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 创建用户
    const userId = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    // 生成 token
    const token = generateToken({ userId, role: 'user' });

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: userId,
        username,
        email,
        avatar,
        role: 'user',
      },
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码为必填项' });
    }

    // 查找用户
    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 token
    const token = generateToken({ userId: user.id, role: user.role });

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}
