import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('🛠️ [Main] Attempting to register Service Worker...');
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('✅ [Main] Service Worker registered successfully with scope:', reg.scope);
      })
      .catch(err => {
        console.error('❌ [Main] Service Worker registration failed:', err);
        console.log('💡 [Main] Tip: Check if /sw.js exists in the public directory and is served correctly.');
      });
  });
} else {
  console.warn('⚠️ [Main] Service Workers are not supported in this browser.');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
