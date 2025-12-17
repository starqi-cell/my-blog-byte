// client/components/Layout/Header/index.tsx
// 头部组件

import React from 'react';
import { Button, Space, Avatar, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined, LoginOutlined, LogoutOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/uiSlice';

import { StyledHeader, Logo, Nav, NavLink } from './style';



const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const userMenuItems = user
    ? [
        {
          key: 'profile',
          label: '个人中心',
          icon: <UserOutlined />,
          onClick: () => navigate('/profile'),
        },
        {
          key: 'create',
          label: '写文章',
          onClick: () => navigate('/article/create'),
        },
        {
          key: 'drafts',
          label: '草稿箱',
          onClick: () => navigate('/profile?tab=draft'),
        },
        ...(user.role === 'admin'
          ? [
              {
                type: 'divider' as const,
              },
              {
                key: 'admin',
                label: '管理后台',
                onClick: () => navigate('/admin'),
              },
              {
                key: 'addAnime',
                label: '添加动漫',
                onClick: () => navigate('/admin/anime/add'),
              },
            ]
          : []),
        {
          type: 'divider' as const,
        },
        {
          key: 'logout',
          label: '退出登录',
          icon: <LogoutOutlined />,
          onClick: handleLogout,
        },
      ]
    : [
        {
          key: 'login',
          label: '登录',
          icon: <LoginOutlined />,
          onClick: () => navigate('/login'),
        },
        {
          key: 'register',
          label: '注册',
          onClick: () => navigate('/register'),
        },
      ];

  return (
    <StyledHeader>
      <Logo to="/">
        <MenuOutlined />
        我的博客
      </Logo>

      <Nav>
        <NavLink to="/">首页</NavLink>
        <NavLink to="/articles">文章</NavLink>
        <NavLink to="/anime">动漫</NavLink>
        <NavLink to="/about">关于</NavLink>

        <Space>
          <Button
            type="text"
            icon={<BulbOutlined />}
            onClick={handleThemeToggle}
            title={theme === 'light' ? '切换到暗黑模式' : '切换到明亮模式'}
          />

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              size="default"
              icon={<UserOutlined />}
              src={user?.avatar}
              style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
            />
          </Dropdown>
        </Space>
      </Nav>
    </StyledHeader>
  );
};

export default Header;
