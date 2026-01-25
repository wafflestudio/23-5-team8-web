import React, { useEffect, useState } from 'react';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.ts';
import { useModalStore } from '../stores/modalStore';
import '../css/header.css';
import '../css/footer.css';
import HomePage from './HomePage.tsx';
import Login from './Login.tsx';
import Register from './Register.tsx';
import SearchPage from './Search.tsx';
import Cart from './Cart.tsx';
import Registration from './RegistrationPage.tsx';
import EnrollmentHistory from './EnrollmentHistory.tsx';
import LeaderBoard from './LeaderBoard.tsx';
import MyPage from './MyPage.tsx';
import PracticeSessionDetail from './PracticeSessionDetail.tsx';
import Warning from '../utils/Warning';

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
    document.body.style.overflow = showLoginWarningOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showLoginWarningOpen]);

  return (
    <div className="app" style={{ paddingTop: !isAuthPage ? '170px' : '0' }}>
      {!isAuthPage && <Header handleLogout={handleLogout} />}
      <div id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/enrollment-history" element={<EnrollmentHistory />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route
            path="/practice-session/:sessionId"
            element={<PracticeSessionDetail />}
          />
        </Routes>
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

function Header({ handleLogout }: { handleLogout: () => void }) {
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
  const [hoverMenu, setHoverMenu] = useState<null | 'search' | 'apply' | 'mba'>(
    null
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const prevent = (e: React.MouseEvent) => e.preventDefault();

  const handleSearch = () => {
    const query = searchInputRef.current?.value || '';
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openLoginWarning();
    }
  };

  const handleConfirmLogin = () => {
    navigate('/login');
    closeLoginWarning();
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
          <div className="logoArea">
            <div className="logoMark">
              <Link to="/">
                <img
                  src="/assets/logo.png"
                  alt="ALLCLEAR"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none';
                  }}
                />
              </Link>
            </div>

            <div className="logoTextArea">
              <div className="logoTitle">
                <Link to="/" className="logoBold">
                  ALLCLEAR
                </Link>
                <span className="logoTerm">2026-1학기</span>
              </div>
              <div className="logoSub">서울대학교 수강신청 연습 시스템</div>
            </div>
          </div>

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

      <div className="headBottom" onMouseLeave={() => setHoverMenu(null)}>
        <div className="containerX headBottomFlex">
          <nav className="gnb" aria-label="메인 메뉴">
            <a
              className={`gnbItem ${
                loc.pathname === '/search' ? 'active' : ''
              }`}
              href="#"
              onClick={prevent}
              onMouseEnter={() => setHoverMenu('search')}
            >
              강좌검색
            </a>
            <a
              className={`gnbItem ${
                loc.pathname.startsWith('/cart') ||
                loc.pathname === '/enrollment-history' ||
                loc.pathname === '/registration'
                  ? 'active'
                  : ''
              }`}
              href="#"
              onClick={prevent}
              onMouseEnter={() => setHoverMenu('apply')}
            >
              수강신청
            </a>
            <a
              className="gnbItem"
              href="#"
              onClick={prevent}
              onMouseEnter={() => setHoverMenu('mba')}
            >
              MBA/EMBA 수강신청
            </a>
            <a
              className="gnbItem"
              href="#"
              onClick={() => openNotSupported()}
              onMouseEnter={() => setHoverMenu(null)}
            >
              수강교과목추천(스누지니)
            </a>
            <Link
              to="/leaderboard"
              className="gnbItem"
              onClick={handleProtectedClick}
            >
              리더보드
            </Link>
          </nav>

          <div className="linkList" aria-label="우측 링크">
            <a className="linkItem" href="#" onClick={() => openNotSupported()}>
              학업이수현황
            </a>
            <Link
              className={`linkItem ${loc.pathname === '/notice' ? 'on' : ''}`}
              to="/notice"
            >
              공지사항
            </Link>
            <a className="linkItem" href="#" onClick={() => openNotSupported()}>
              FAQ
            </a>
            <a className="linkItem" href="#" onClick={() => openNotSupported()}>
              수업교시기준
            </a>
            <a className="linkItem" href="#" onClick={() => openNotSupported()}>
              ENGLISH
            </a>
          </div>
        </div>

        {hoverMenu && (
          <div
            className="subNavBar"
            onMouseEnter={() => setHoverMenu(hoverMenu)}
          >
            <div className="containerX subNavInner">
              {hoverMenu === 'search' && (
                <div className="subNavList">
                  <a
                    className="subNavItem"
                    href="#"
                    onClick={() => openNotSupported()}
                  >
                    관심강좌
                  </a>
                  <a
                    className="subNavItem"
                    href="#"
                    onClick={() => openNotSupported()}
                  >
                    수강지도상담
                  </a>
                </div>
              )}
              {hoverMenu === 'apply' && (
                <div className="subNavList">
                  <a
                    className="subNavItem"
                    href="#"
                    onClick={() => openNotSupported()}
                  >
                    예비장바구니
                  </a>
                  <a
                    className="subNavItem"
                    href="#"
                    onClick={() => openNotSupported()}
                  >
                    예비수강신청
                  </a>
                  <a
                    className="subNavItem"
                    href="#"
                    onClick={() => openNotSupported()}
                  >
                    예비수강신청내역
                  </a>
                  <span className="subNavSep" aria-hidden="true" />

                  <Link
                    className="subNavItem"
                    to="/cart"
                    onClick={handleProtectedClick}
                  >
                    장바구니
                  </Link>
                  <Link
                    className="subNavItem"
                    to="/registration"
                    onClick={handleProtectedClick}
                  >
                    수강신청
                  </Link>
                  <Link
                    className="subNavItem"
                    to="/enrollment-history"
                    onClick={handleProtectedClick}
                  >
                    수강신청내역
                  </Link>
                  <span className="subNavSep" aria-hidden="true" />
                  <a
                    className="subNavItem"
                    href="#"
                    onClick={() => openNotSupported()}
                  >
                    정원 외 신청
                  </a>
                </div>
              )}
              {hoverMenu === 'mba' && (
                <div className="subNavList">
                  <a
                    className="subNavItem"
                    href="#"
                    onClick={() => openNotSupported()}
                  >
                    MBA 수강신청
                  </a>
                  <a
                    className="subNavItem"
                    href="#"
                    onClick={() => openNotSupported()}
                  >
                    EMBA 수강신청
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
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

type NoticeItem = { id: number; title: string };
const DUMMY_NOTICES: NoticeItem[] = [
  {
    id: 1,
    title: '더미 공지사항 1 (예: 수강편람 게시)',
  },
  {
    id: 2,
    title: '더미 공지사항 2 (예: 브라우저 캐시 삭제 안내)',
  },
  {
    id: 3,
    title: '더미 공지사항 3 (예: 시스템 점검 일정)',
  },
  {
    id: 4,
    title: '더미 공지사항 4 (예: 유의사항 안내)',
  },
];

function NoticePage() {
  return (
    <main className="page">
      <div className="containerX">
        <section className="card">
          <div className="cardInner">
            <div className="sectionHeadRow">
              <h2 className="titleLine">
                <strong className="blue">공지사항</strong>
              </h2>
              <Link className="moreLink" to="/">
                홈으로 ←
              </Link>
            </div>
            <div className="noticeList">
              {DUMMY_NOTICES.map((n) => (
                <a
                  key={n.id}
                  className="noticeItem"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  {n.title}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Footer({ onOpenModal }: { onOpenModal: () => void }) {
  const { user, timeLeft } = useAuth();
  const { openNotSupported } = useModalStore();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="footer">
      <div className="containerX footerInner">
        <div className="footerLeft">
          <div className="footerLinks">
            <a
              href="#"
              className="footerLinkItem bold"
              onClick={() => openNotSupported()}
            >
              개인정보처리방침
            </a>
            <span className="divider">|</span>
            <a
              href="#"
              className="footerLinkItem bold"
              onClick={() => openNotSupported()}
            >
              이메일무단수집거부
            </a>
          </div>
          <div className="footerCopy">
            Copyright (C) 2020 SEOUL NATIONAL UNIVERSITY. All Rights Reserved.
          </div>
        </div>

        {user ? (
          <div className="footerRight">
            <div className="footerRightLeftColumn">
              <div className="timerInfoUp">
                <span className="timerLabel">자동 로그아웃 남은시간</span>
                <div className="timerDisplay">
                  <svg
                    className="timerIcon"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="timerTime">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <span className="timerInfoDown">
                10분간 사용하지 않을 경우 자동로그아웃 됩니다.
              </span>
            </div>
            <button className="extendBtn" onClick={onOpenModal}>
              지금 로그인 연장
            </button>
          </div>
        ) : (
          <div className="footerRight"></div>
        )}
      </div>
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
