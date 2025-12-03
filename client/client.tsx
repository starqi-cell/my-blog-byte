//client/client.tsx
// 入口文件

import ReactDOM from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');

if (!root) {
  throw new Error('没有找到根元素 #root');
}

// 开发环境使用 createRoot，生产环境 SSR 使用 hydrateRoot
if (import.meta.env.DEV) {
  ReactDOM.createRoot(root).render(<App />);
} else {
  ReactDOM.hydrateRoot(root, <App />);
}
