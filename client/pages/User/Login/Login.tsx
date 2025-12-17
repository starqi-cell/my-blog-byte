// client/pages/User/Login/Login.tsx
// 登录页面

import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { LoginContainer, LoginCard, Title, LoginButton, RegisterLink } from './style';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await dispatch(login(values)).unwrap();
      message.success('登录成功');
      navigate('/');
    } catch (error: any) {
      message.error(error || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>登录</Title>
        <Form onFinish={handleSubmit} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <LoginButton type="primary" htmlType="submit" loading={loading}>
              登录
            </LoginButton>
          </Form.Item>
        </Form>

        <RegisterLink>
          还没有账号？ <Link to="/register">立即注册</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
