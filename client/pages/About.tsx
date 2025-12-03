import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.text};
  line-height: 2;

  h2 {
    margin-top: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  ul {
    list-style: disc;
    margin-left: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Card>
        <Title>关于本博客</Title>
        <Content>
          <h2>项目简介</h2>
          <p>
            这是一个基于现代技术栈构建的全栈 SSR 博客系统，旨在提供高性能、高可用、高体验的内容发布平台。
          </p>

          <h2>技术栈</h2>
          <ul>
            <li><strong>前端：</strong>React 18 + TypeScript + Vite</li>
            <li><strong>状态管理：</strong>Redux Toolkit</li>
            <li><strong>UI 组件：</strong>Ant Design</li>
            <li><strong>样式方案：</strong>Styled Components</li>
            <li><strong>后端：</strong>Express + TypeScript</li>
            <li><strong>数据库：</strong>MySQL 8.0</li>
            <li><strong>缓存：</strong>Redis 7</li>
            <li><strong>部署：</strong>Docker + Docker Compose</li>
          </ul>

          <h2>核心功能</h2>
          <ul>
            <li>✅ SSR 服务端渲染，提升首屏加载速度和 SEO 友好度</li>
            <li>✅ 完整的文章 CRUD 操作</li>
            <li>✅ Markdown 编辑器，支持实时预览</li>
            <li>✅ AI 写作助手，智能生成内容</li>
            <li>✅ 用户认证与权限管理</li>
            <li>✅ 评论系统，支持嵌套回复</li>
            <li>✅ 标签分类管理</li>
            <li>✅ 暗黑模式切换</li>
            <li>✅ Redis 缓存优化</li>
            <li>✅ HTTP 缓存策略</li>
            <li>✅ 响应式设计，移动端适配</li>
          </ul>

          <h2>项目特色</h2>
          <ul>
            <li><strong>高性能：</strong>SSR + Redis 缓存 + 代码分割，极致的加载速度</li>
            <li><strong>高可用：</strong>服务端降级方案，保障核心功能可用</li>
            <li><strong>高体验：</strong>极简蓝色主题，流畅的交互动画</li>
            <li><strong>高扩展：</strong>模块化设计，易于二次开发</li>
          </ul>

          <h2>开发团队</h2>
          <p>
            本项目由 GitHub Copilot 协助开发完成，展示了 AI 辅助编程的强大能力。
          </p>

          <h2>开源协议</h2>
          <p>
            本项目采用 MIT 开源协议，欢迎学习、使用和贡献。
          </p>
        </Content>
      </Card>
    </AboutContainer>
  );
};

export default About;
