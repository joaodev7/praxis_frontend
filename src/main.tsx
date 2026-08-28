import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Disable React DevTools in production
if (import.meta.env.PROD && typeof window !== 'undefined') {
  const devToolsHook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (typeof devToolsHook === 'object' && devToolsHook !== null) {
    for (const [key, value] of Object.entries(devToolsHook)) {
      (devToolsHook as any)[key] = typeof value === 'function' ? () => {} : null;
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
