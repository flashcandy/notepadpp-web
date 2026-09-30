import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Suppress benign [vite] websocket warnings in AI Studio preview iframe
if (typeof window !== 'undefined') {
  const origWarn = console.warn;
  const origError = console.error;
  console.warn = (...args: any[]) => {
    if (args[0] && typeof args[0] === 'string' && (args[0].includes('[vite]') || args[0].includes('WebSocket'))) return;
    origWarn.apply(console, args);
  };
  console.error = (...args: any[]) => {
    if (args[0] && typeof args[0] === 'string' && (args[0].includes('[vite]') || args[0].includes('WebSocket'))) return;
    origError.apply(console, args);
  };
}

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
