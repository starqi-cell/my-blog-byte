// client/pages/Home/style.ts
// 主页样式

import styled from 'styled-components';

export const HomeContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const Sidebar = styled.div`
  position: sticky;
  top: 80px;
`;