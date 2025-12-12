// client/pages/About/styled.ts
// 关于页面样式

import styled from 'styled-components';

export const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
`;

export const Content = styled.div`
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