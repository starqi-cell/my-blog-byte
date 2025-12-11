// client/AppContent.tsx
// 应用内容组件，包含路由和主题等配置

import React, { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import { ConfigProvider, theme as antTheme, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { useAppSelector, useAppDispatch } from './store/hooks.ts';
import { fetchProfile } from './store/slices/authSlice.ts';
import { lightTheme, darkTheme } from './styles/theme.ts';
import { GlobalStyle } from './styles/GlobalStyle.ts';
import Layout from './components/Layout/index.tsx';
import routes from './router/index.tsx';


const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const { token, user } = useAppSelector((state) => state.auth);
  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;
  const element = useRoutes(routes);

  // 页面加载时，如果有 token 但没有用户信息，则自动获取用户信息
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);
  const API_BASE = import.meta.env.VITE_API_BASE || '/api';
  console.log(API_BASE);

  return (
    <ThemeProvider theme={currentTheme}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: themeMode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <GlobalStyle theme={currentTheme} />
        <Layout>
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <Spin size="large" tip="加载中..." />
            </div>
          }>
            {element}
          </Suspense>
        </Layout>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default AppContent;