import React from 'react';
import { createRoot} from 'react-dom/client';
import './dist/output.css';
import App from './App';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
console.log(root);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);