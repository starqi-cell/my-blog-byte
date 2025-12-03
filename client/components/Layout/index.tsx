import React from 'react';
import { Layout as AntLayout } from 'antd';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const { Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

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
