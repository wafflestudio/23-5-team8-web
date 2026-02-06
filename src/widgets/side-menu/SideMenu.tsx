import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useTimer } from '@features/auth';
import './sideMenu.css';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { label: '장바구니', path: '/cart', requireAuth: true },
  { label: '수강신청', path: '/registration', requireAuth: true },
  { label: '수강신청내역', path: '/enrollment-history', requireAuth: true },
  { label: '연습결과상세', path: '/practice-results', requireAuth: true },
  { label: '리더보드', path: '/leaderboard' },
];

export default function SideMenu({ isOpen, onClose, onLogout }: SideMenuProps) {
  const { user } = useAuth();
  const { timeLeft, extendLogin } = useTimer();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNavClick = (path: string, requireAuth?: boolean) => {
    if (requireAuth && !user) {
      navigate('/login');
    } else {
      navigate(path);
    }
    onClose();
  };

  return (
    <>
      <div
        className={`sideMenuOverlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      <div className={`sideMenuPanel ${isOpen ? 'active' : ''}`}>
        <div className="sideMenuHeader">
          <div className="sideMenuUserLabel">
            {user ? (
              <span className="sideMenuUserName">{user.nickname} 님</span>
            ) : (
              <span className="sideMenuLoginPrompt">로그인 하세요.</span>
            )}
          </div>
          <button
            className="sideMenuCloseBtn"
            aria-label="메뉴 닫기"
            onClick={onClose}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {user && (
          <div className="sideMenuLogoutArea">
            <button className="sideMenuLogoutBtn" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        )}

        <hr className="sideMenuDivider" />

        <nav className="sideMenuNav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`sideMenuNavItem ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path, item.requireAuth)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {user && (
          <div className="sideMenuTimer">
            <div className="sideMenuTimerLabel">자동 로그아웃 남은시간</div>
            <div className="sideMenuTimerDisplay">
              <svg
                className="sideMenuTimerIcon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button className="sideMenuExtendBtn" onClick={extendLogin}>
              로그인 연장
            </button>
          </div>
        )}
      </div>
    </>
  );
}
