import React from 'react';
import { Layout, Button, Space, Avatar, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined, LoginOutlined, LogoutOutlined, BulbOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/uiSlice';

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)`
  background-color: ${({ theme }) => theme.colors.surface} !important;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary} !important;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover} !important;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  transition: color ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

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
