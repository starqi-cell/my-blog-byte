// client/pages/Home/c-cpns/ArticleList/style.ts
// 文章列表样式

import { Pagination } from 'antd';
import styled from 'styled-components';

export const ListContainer = styled.div`
  min-height: 400px;
`;

export const StyledPagination = styled(Pagination)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;