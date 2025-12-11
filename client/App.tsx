// client/App.tsx
// 应用的根组件

import React from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store/index.ts';
import AppContent from './AppContent.tsx';


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </Provider>
  );
};

export default App;
