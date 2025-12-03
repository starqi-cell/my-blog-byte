import React from 'react';
import { Layout } from 'antd';
import { GithubOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Footer: AntFooter } = Layout;

const StyledFooter = styled(AntFooter)`
  background-color: ${({ theme }) => theme.colors.surface} !important;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.lg};

  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: color ${({ theme }) => theme.transition.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Copyright = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <FooterContent>
        <SocialLinks>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
            <GithubOutlined />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
            <TwitterOutlined />
          </a>
          <a href="mailto:contact@blog.com" title="Email">
            <MailOutlined />
          </a>
        </SocialLinks>
        <Copyright>
          © {currentYear} 我的博客. All rights reserved. Built with React + TypeScript + SSR
        </Copyright>
      </FooterContent>
    </StyledFooter>
  );
};

export default Footer;
