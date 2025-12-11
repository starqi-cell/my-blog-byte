


import React from 'react';
import { Card } from 'antd';
import { AboutContainer, Title, Content } from './styled.ts';

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Card>
        <Title>关于本博客</Title>
        <Content>
          <h2>项目简介</h2>
          <p>
            这是本人制作的一个 SSR 博客系统。
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
        </Content>
      </Card>
    </AboutContainer>
  );
};

export default About;
