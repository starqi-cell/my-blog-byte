// client/components/Layout/Footer/Footer.tsx
// 页脚组件

import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { StyledFooter, FooterContent, SocialLinks, Copyright } from './style';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <FooterContent>
        <SocialLinks>
          <a href="https://github.com/starqi-cell" target="_blank" rel="noopener noreferrer" title="GitHub">
            <GithubOutlined />
          </a>
        </SocialLinks>
        <Copyright>
          © {currentYear} 我的博客
        </Copyright>
      </FooterContent>
    </StyledFooter>
  );
};

export default Footer;
