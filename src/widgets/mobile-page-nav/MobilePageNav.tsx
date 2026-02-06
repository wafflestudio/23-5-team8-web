import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import './mobilePageNav.css';

const NAV_ITEMS = [
  { label: '장바구니', path: '/cart', requireAuth: true },
  { label: '수강신청', path: '/registration', requireAuth: true },
  { label: '수강신청내역', path: '/enrollment-history', requireAuth: true },
  { label: '연습결과상세', path: '/practice-results', requireAuth: true },
  { label: '리더보드', path: '/leaderboard' },
];

export default function MobilePageNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentItem = NAV_ITEMS.find((item) => item.path === location.pathname);

  if (!currentItem) return null;

  const handleNavClick = (path: string, requireAuth?: boolean) => {
    if (requireAuth && !user) {
      navigate('/login');
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <div className="mobilePageNav">
      <button
        className="mobilePageNav-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="페이지 메뉴 토글"
      >
        <span className="mobilePageNav-title">{currentItem.label}</span>
        <span className={`mobilePageNav-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="mobilePageNav-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <nav className="mobilePageNav-dropdown">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                className={`mobilePageNav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path, item.requireAuth)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
