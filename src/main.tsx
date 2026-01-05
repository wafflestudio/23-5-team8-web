import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.tsx';
import Login from './Login.tsx';
import './header.css';
import './homePage.css';
import './login.css';
import './cart.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
