import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@app/configuration/i18n.ts';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@app/components/error-boundary/index.ts';
import { ConfigProvider } from 'antd';
import { QueryProvider } from '@app/components/query-provider/QueryProvider.tsx';

import 'normalize.css';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider wave={{ disabled: true }}>
        <ErrorBoundary>
          <QueryProvider>
            <App />
          </QueryProvider>
        </ErrorBoundary>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
