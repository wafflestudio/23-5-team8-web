import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import { useModalStore } from '@shared/model/modalStore';
import { Warning } from '@shared/ui/Warning';
import './header.css';

interface HeaderProps {
  handleLogout: () => void;
}

export default function Header({ handleLogout }: HeaderProps) {
  const loc = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    showLoginWarning,
    showNotSupported,
    openLoginWarning,
    closeLoginWarning,
    openNotSupported,
    closeNotSupported,
  } = useModalStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const query = searchInputRef.current?.value || '';
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleConfirmLogin = () => {
    navigate('/login');
    closeLoginWarning();
  };

  const handleProtectedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      openLoginWarning();
    }
  };

  useEffect(() => {
    const isModalOpen = showLoginWarning || showNotSupported;
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showLoginWarning, showNotSupported]);

  useEffect(() => {
    if (searchInputRef.current) {
      if (loc.pathname === '/search') {
        const params = new URLSearchParams(loc.search);
        const query = params.get('query');
        searchInputRef.current.value = query || '';
      } else {
        searchInputRef.current.value = '';
      }
    }
  }, [loc.pathname, loc.search]);

  return (
    <header className="header">
      <div className="headTop">
        <div className="containerX headTopGrid">
          <Link to="/" className="logoArea">
            <div className="logoMark">
              <img
                src="/assets/logo.png"
                alt="ALLCLEAR"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            <div className="logoTextArea">
              <div className="logoTitle">
                <span className="logoBold">ALLCLEAR</span>
                <span className="logoTerm">2026-1학기</span>
              </div>
              <div className="logoSub">서울대학교 수강신청 연습 시스템</div>
            </div>
          </Link>

          <div className="searchArea">
            <div className="searchBox">
              <select className="searchSelect" disabled>
                <option>Search</option>
              </select>
              <input
                className="searchInput"
                placeholder="전체 강좌 검색은 돋보기 버튼을 클릭하세요"
                ref={searchInputRef}
                onKeyDown={handleKeyDown}
              />
              <button
                className="iconBtn"
                aria-label="검색"
                onClick={handleSearch}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="6.5" />
                  <line x1="15.8" y1="15.8" x2="21.2" y2="21.2" />
                </svg>
              </button>
              <span className="searchSep" aria-hidden="true"></span>
              <button
                className="iconBtn"
                aria-label="필터"
                onClick={() => openNotSupported()}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <circle cx="9" cy="6" r="1.8" fill="#fff" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <circle cx="14" cy="12" r="1.8" fill="#fff" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                  <circle cx="11" cy="18" r="1.8" fill="#fff" />
                </svg>
              </button>
            </div>
            {user && (
              <div className="userInfoArea">
                <button
                  className="userInfoBtn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="userInfoText">
                    <span className="userName">
                      {user.nickname}
                      <span className="nim">님</span>
                    </span>
                    <span className="welcome">환영합니다!</span>
                  </div>
                  <span
                    className={`userIcon ${showUserMenu && user ? 'open' : ''}`}
                  >
                    ▼
                  </span>
                </button>

                <div
                  className={`userDropdown ${
                    showUserMenu && user ? 'active' : ''
                  }`}
                >
                  <Link to="/mypage" className="userDropItem">
                    마이페이지
                  </Link>
                  <a href="#" className="userDropItem" onClick={handleLogout}>
                    로그아웃
                  </a>
                </div>
              </div>
            )}

            <button className="mobileSearchBtn" aria-label="검색 열기">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="6.5" />
                <line x1="15.8" y1="15.8" x2="21.2" y2="21.2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="headBottom">
        <div className="containerX headBottomFlex">
          <nav className="gnb" aria-label="메인 메뉴">
            <Link
              className={`gnbItem ${loc.pathname === '/cart' ? 'active' : ''}`}
              to="/cart"
              onClick={handleProtectedClick}
            >
              장바구니
            </Link>
            <Link
              className={`gnbItem ${loc.pathname === '/registration' ? 'active' : ''}`}
              to="/registration"
              onClick={handleProtectedClick}
            >
              수강신청
            </Link>
            <Link
              className={`gnbItem ${loc.pathname === '/enrollment-history' ? 'active' : ''}`}
              to="/enrollment-history"
              onClick={handleProtectedClick}
            >
              수강신청내역
            </Link>

            <Link
              className={`gnbItem ${loc.pathname === '/leaderboard' ? 'active' : ''}`}
              to="/leaderboard"
            >
              리더보드
            </Link>
            <Link
              className={`gnbItem ${loc.pathname === '/mypage' ? 'active' : ''}`}
              to="/mypage"
              onClick={handleProtectedClick}
            >
              연습 결과 상세
            </Link>
          </nav>
        </div>
      </div>
      <Warning
        variant="double"
        icon="question"
        isOpen={showLoginWarning}
        onClose={closeLoginWarning}
        onConfirm={handleConfirmLogin}
      >
        <p className="warningText">
          로그인 후 사용할 수 있는 기능입니다.
          <br />
          로그인하시겠습니까?
        </p>
      </Warning>
      <Warning
        variant="single"
        icon="warning"
        isOpen={showNotSupported}
        onClose={closeNotSupported}
      >
        <p className="warningText">지원하지 않는 기능입니다.</p>
      </Warning>
    </header>
  );
}
