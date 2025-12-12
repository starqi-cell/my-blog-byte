
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { ServerStyleSheet } from 'styled-components';
import { store } from '../client/store/index.js';
import App from '../client/App.js';

export interface RenderResult {
  html: string;
  status: number;
}

export async function render(url: string): Promise<RenderResult> {
  const sheet = new ServerStyleSheet();

  try {
    const html = renderToString(
      sheet.collectStyles(
        <Provider store={store}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </Provider>
      )
    );

    const styleTags = sheet.getStyleTags();

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>我的博客 - SSR Blog System</title>
          <meta name="description" content="基于 React + TypeScript + SSR 构建的现代化博客系统" />
          ${styleTags}
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            #root { min-height: 100vh; }
          </style>
        </head>
        <body>
          <div id="root">${html}</div>
          <script type="module" src="/client/client.js"></script>
        </body>
      </html>
    `;

    return {
      html: fullHtml,
      status: 200,
    };
  } catch (error) {
    console.error('SSR 渲染错误:', error);

    // 降级方案：返回基础 HTML 骨架
    const fallbackHtml = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>我的博客 - SSR Blog System</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f0f2f5;
            }
            .loading { text-align: center; }
            .loading h2 { color: #1890ff; margin-bottom: 16px; }
            .loading p { color: #666; }
          </style>
        </head>
        <body>
          <div id="root">
            <div class="loading">
              <h2>加载中...</h2>
              <p>正在为您准备内容</p>
            </div>
          </div>
          <script type="module" src="/client/client.js"></script>
        </body>
      </html>
    `;

    return {
      html: fallbackHtml,
      status: 200,
    };
  } finally {
    sheet.seal();
  }
}
