import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@app/configuration/i18n.ts';
import { BrowserRouter } from 'react-router-dom';
import 'normalize.css';
import './index.scss';
import { ErrorBoundary } from '@app/components/error-boundary/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
