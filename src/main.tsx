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

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }
  const {worker} = await import('./mocks/browser');
  // 핸들러에 없는 요청은 경고 없이 통과(bypass)시킵니다.
  return worker.start({onUnhandledRequest: 'bypass'});
}

enableMocking().then(() => {
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
});
