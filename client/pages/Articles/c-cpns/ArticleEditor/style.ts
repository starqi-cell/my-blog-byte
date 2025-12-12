// client/pages/ArticleEditor/style.ts
// 文章编辑器样式文件

import styled from 'styled-components';
import { Button, Card } from 'antd';

export const EditorContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 0;
`;

export const EditorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const PreviewCard = styled(Card)`
  height: 600px;
  overflow-y: auto;
`;

export const AIButton = styled(Button)`
  margin-bottom: 16px;
  margin-right: 8px;
`;

export const Toolbar = styled.div`
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;