import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/ui/App';
import './app/index.css';

console.log('[App] Starting initialization from apps/frontend/index.tsx');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[App] Root element not found!');
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('[App] Render called');
} catch (e) {
  console.error('[App] Error during render:', e);
}