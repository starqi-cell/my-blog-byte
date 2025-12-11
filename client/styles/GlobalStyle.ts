// client/styles/GlobalStyle.ts
// 全局样式

import { createGlobalStyle } from 'styled-components';
import type { Theme } from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji';
    font-size: ${({ theme }) => theme.fontSize.md};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    transition: background-color ${({ theme }) => theme.transition.normal},
      color ${({ theme }) => theme.transition.normal};
  }

  a {
    color: ${({ theme }) => theme.colors.link};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transition.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.linkHover};
    }

    &:active {
      color: ${({ theme }) => theme.colors.linkActive};
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    line-height: 1.4;
  }

  h1 { font-size: ${({ theme }) => theme.fontSize.xxxl}; }
  h2 { font-size: ${({ theme }) => theme.fontSize.xxl}; }
  h3 { font-size: ${({ theme }) => theme.fontSize.xl}; }
  h4 { font-size: ${({ theme }) => theme.fontSize.lg}; }
  h5 { font-size: ${({ theme }) => theme.fontSize.md}; }
  h6 { font-size: ${({ theme }) => theme.fontSize.sm}; }

  p {
    margin: 0;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
  }

  code {
    font-family: 'Courier New', Courier, monospace;
    padding: 2px 6px;
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 0.9em;
  }

  pre {
    font-family: 'Courier New', Courier, monospace;
    padding: ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow-x: auto;
    
    code {
      padding: 0;
      background: none;
    }
  }

  /* Ant Design 样式覆盖 */
  .ant-layout {
    background-color: ${({ theme }) => theme.colors.background};
  }

  .ant-card {
    background-color: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.border};
  }

  .ant-btn-primary {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryHover};
      border-color: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  /* 滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};

    &:hover {
      background: ${({ theme }) => theme.colors.textTertiary};
    }
  }
`;
