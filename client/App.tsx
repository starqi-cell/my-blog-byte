import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider, theme as antTheme, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store/index.ts';
import { useAppSelector } from './store/hooks.ts';
import { lightTheme, darkTheme } from './styles/theme.ts';
import { GlobalStyle } from './styles/GlobalStyle.ts';
import Layout from './components/Layout/index.tsx';
import routes from './router/index.tsx';

// 内部组件：处理主题和路由逻辑
// 必须在 Provider 和 Router 内部才能使用 hooks
const AppContent: React.FC = () => {
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;
  const element = useRoutes(routes);

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
        {/* @ts-ignore */}
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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </Provider>
  );
};

export default App;
