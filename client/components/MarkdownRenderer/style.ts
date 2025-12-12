// client/components/MarkdownRenderer/style.ts
// Markdown 渲染组件样式文件
import styled from 'styled-components';

export const MarkdownContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;

  h1, h2, h3, h4, h5, h6 {
    margin-top: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.text};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSize.xxxl};
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSize.xxl};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  a {
    color: ${({ theme }) => theme.colors.link};
    text-decoration: underline;

    &:hover {
      color: ${({ theme }) => theme.colors.linkHover};
    }
  }

  ul, ol {
    margin-left: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    list-style: initial;
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  blockquote {
    margin: ${({ theme }) => theme.spacing.md} 0;
    padding: ${({ theme }) => theme.spacing.md};
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textSecondary};

    p:last-child {
      margin-bottom: 0;
    }
  }

  code {
    font-family: 'Courier New', Courier, monospace;
    padding: 2px 6px;
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 0.9em;
    color: ${({ theme }) => theme.colors.error};
  }

  pre {
    margin: ${({ theme }) => theme.spacing.md} 0;
    padding: ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow-x: auto;
    border: 1px solid ${({ theme }) => theme.colors.border};

    code {
      padding: 0;
      background: none;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  table {
    width: 100%;
    margin: ${({ theme }) => theme.spacing.md} 0;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
  }

  th {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }

  img {
    max-width: 100%;
    height: auto;
    margin: ${({ theme }) => theme.spacing.md} 0;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  hr {
    margin: ${({ theme }) => theme.spacing.xl} 0;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;