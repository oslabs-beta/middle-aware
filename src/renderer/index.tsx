import React from 'react';
import { createRoot} from 'react-dom/client';
import './App.css';
import App from './App';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
console.log(root);
console.log(App);
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// createRoot(document.querySelector('#root')).render(
//   <App />
// )

// import { createRoot } from 'react-dom/client';
// const container = document.getElementById('app');
// const root = createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(<App tab="home" />);
// createRoot(document.querySelector('#App')).render(