// client/components/Layout/style.ts
// 布局组件样式

import { Layout } from 'antd';
import styled from 'styled-components';

const { Content } = Layout;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

export const StyledContent = styled(Content)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;