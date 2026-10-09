import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import {AdminApp} from './features/admin/AdminApp.tsx';
import './assets/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter><Routes><Route path="/login/admin/*" element={<AdminApp/>}/><Route path="/admin/*" element={<AdminApp/>}/><Route path="*" element={<App/>}/></Routes></BrowserRouter>
  </StrictMode>,
);
