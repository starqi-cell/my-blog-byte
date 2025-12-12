// client/components/Layout/index.tsx
// 布局组件

import React from 'react';
import Header from './Header';
import Footer from './Footer/Footer';
import { StyledLayout, StyledContent } from './style';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <StyledContent>{children}</StyledContent>
      <Footer />
    </StyledLayout>
  );
};

export default Layout;
