import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './tsx/App.tsx';
import Login from './tsx/Login.tsx';
import './css/header.css';
import './css/cart.css';
import './css/login.css';
import './css/cart.css';
import {AuthProvider} from './contexts/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/*' element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
