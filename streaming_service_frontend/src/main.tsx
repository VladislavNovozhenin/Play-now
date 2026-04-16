import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@app/configuration/i18n.ts';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@app/components/error-boundary/index.ts';
import { QueryProvider } from '@app/components/query-provider/QueryProvider.tsx';
import 'normalize.css';
import '@shared/styles/index.scss';
import { AntDesignProvider } from '@app/components/antd-provider/AntDesignProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AntDesignProvider>
        <ErrorBoundary>
          <QueryProvider>
            <App />
          </QueryProvider>
        </ErrorBoundary>
      </AntDesignProvider>
    </BrowserRouter>
  </StrictMode>
);
