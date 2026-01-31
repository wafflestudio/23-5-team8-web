import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import { Header } from '@widgets/header';
import { Footer } from '@widgets/footer';
import { Warning } from '@shared/ui/Warning';
import { AppRoutes } from './routes';
import './styles/global.css';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, timeLeft, extendLogin, logout } = useAuth();
  const [showLoginWarningOpen, setShowLoginWarningOpen] = useState(false);
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/mypage' ||
    location.pathname.startsWith('/practice-session/');

  const handleLogout = async () => {
    setShowLoginWarningOpen(false);
    await logout();
    navigate('/');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = showLoginWarningOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showLoginWarningOpen]);

  return (
    <div className="app" style={{ paddingTop: !isAuthPage ? '170px' : '0' }}>
      {!isAuthPage && <Header handleLogout={handleLogout} />}
      <div id="main">
        <AppRoutes />
      </div>
      {!isAuthPage && (
        <Footer onOpenModal={() => setShowLoginWarningOpen(true)} />
      )}
      {user && (timeLeft <= 60 || showLoginWarningOpen) && timeLeft > 0 && (
        <SessionWarningModal
          timeLeft={timeLeft}
          onExtend={extendLogin}
          onLogout={handleLogout}
          setShowLoginWarningOpen={setShowLoginWarningOpen}
        />
      )}
    </div>
  );
}

function SessionWarningModal({
  timeLeft,
  onExtend,
  onLogout,
  setShowLoginWarningOpen,
}: {
  timeLeft: number;
  onExtend: () => void;
  onLogout: () => void;
  setShowLoginWarningOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Warning
      variant="double"
      isOpen={true}
      onClose={onLogout}
      onConfirm={() => {
        onExtend();
        setShowLoginWarningOpen(false);
      }}
      title="로그인 연장"
      cancelLabel="로그아웃"
      confirmLabel="로그인 연장"
    >
      <p className="sessionMsg">
        로그인 연장을 원하지 않으실 경우,
        <br />
        자동로그아웃 됩니다.
      </p>
      <div className="sessionTimerBox">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff5722"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: '4px', verticalAlign: 'middle' }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span className="sessionTimerText">{formatTime(timeLeft)}</span>
      </div>
    </Warning>
  );
}
