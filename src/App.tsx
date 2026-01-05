import React from 'react';
import {Link, Route, Routes, useLocation} from 'react-router-dom';
import './header.css';
import HomePage from './HomePage.tsx';
import Login from './Login.tsx';
import Register from './Register.tsx';

export default function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className='app'>
      <a href='#main' className='skip'>
        본문 영역으로 바로가기
      </a>
      {!isAuthPage && <Header />}
      <div id='main'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/notice' element={<NoticePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function Header() {
  const loc = useLocation();
  const [hoverMenu, setHoverMenu] = React.useState<
    null | 'search' | 'apply' | 'mba'
  >(null);
  const prevent = (e: React.MouseEvent) => e.preventDefault();

  return (
    <header className='header'>
      <div className='headTop'>
        <div className='containerX headTopGrid'>
          <div className='logoArea'>
            <div className='logoMark'>
              <Link to='/'>
                <img
                  src='/src/assets/logo.png'
                  alt='SNU CRS'
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none';
                  }}
                />
              </Link>
            </div>

            <div className='logoTitle'>
              <span className='logoBold'>
                SNU <span className='logoSemiBold'>CRS</span>
              </span>
              <span className='logoTerm'>2025-겨울학기</span>
            </div>
            <div className='logoSub'>서울대학교 수강신청 시스템</div>
          </div>

          <div className='searchArea'>
            {/* PC용 검색 박스 */}
            <div className='searchBox'>
              <select className='searchSelect' disabled>
                <option>Search</option>
              </select>
              <input
                className='searchInput'
                placeholder='전체 강좌 검색은 돋보기 버튼을 클릭하세요'
              />
              <button className='iconBtn' aria-label='검색'>
                <svg
                  viewBox='0 0 24 24'
                  width='22'
                  height='22'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='11' cy='11' r='6.5' />
                  <line x1='15.8' y1='15.8' x2='21.2' y2='21.2' />
                </svg>
              </button>
              <span className='searchSep' aria-hidden='true'></span>
              <button className='iconBtn' aria-label='필터'>
                <svg
                  viewBox='0 0 24 24'
                  width='22'
                  height='22'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.6'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='4' y1='6' x2='20' y2='6' />
                  <circle cx='9' cy='6' r='1.8' fill='#fff' />
                  <line x1='4' y1='12' x2='20' y2='12' />
                  <circle cx='14' cy='12' r='1.8' fill='#fff' />
                  <line x1='4' y1='18' x2='20' y2='18' />
                  <circle cx='11' cy='18' r='1.8' fill='#fff' />
                </svg>
              </button>
            </div>

            {/* 모바일용 돋보기 버튼 (기본 숨김) */}
            <button className='mobileSearchBtn' aria-label='검색 열기'>
              <svg
                viewBox='0 0 24 24'
                width='24'
                height='24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='11' cy='11' r='6.5' />
                <line x1='15.8' y1='15.8' x2='21.2' y2='21.2' />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className='headBottom' onMouseLeave={() => setHoverMenu(null)}>
        <div className='containerX headBottomFlex'>
          <nav className='gnb' aria-label='메인 메뉴'>
            <a
              className='gnbItem'
              href='#'
              onClick={prevent}
              onMouseEnter={() => setHoverMenu('search')}
            >
              강좌검색
            </a>
            <a
              className='gnbItem'
              href='#'
              onClick={prevent}
              onMouseEnter={() => setHoverMenu('apply')}
            >
              수강신청
            </a>
            <a
              className='gnbItem'
              href='#'
              onClick={prevent}
              onMouseEnter={() => setHoverMenu('mba')}
            >
              MBA/EMBA 수강신청
            </a>
            <a
              className='gnbItem'
              href='#'
              onClick={prevent}
              onMouseEnter={() => setHoverMenu(null)}
            >
              수강교과목추천(스누지니)
            </a>
          </nav>

          <div className='linkList' aria-label='우측 링크'>
            <a className='linkItem' href='#' onClick={prevent}>
              학업이수현황
            </a>
            <Link
              className={`linkItem ${loc.pathname === '/notice' ? 'on' : ''}`}
              to='/notice'
            >
              공지사항
            </Link>
            <a className='linkItem' href='#' onClick={prevent}>
              FAQ
            </a>
            <a className='linkItem' href='#' onClick={prevent}>
              수업교시기준
            </a>
            <a className='linkItem' href='#' onClick={prevent}>
              ENGLISH
            </a>
          </div>
        </div>

        {hoverMenu && (
          <div
            className='subNavBar'
            onMouseEnter={() => setHoverMenu(hoverMenu)}
          >
            <div className='containerX subNavInner'>
              {hoverMenu === 'search' && (
                <div className='subNavList'>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    관심강좌
                  </a>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    수강지도상담
                  </a>
                </div>
              )}
              {hoverMenu === 'apply' && (
                <div className='subNavList'>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    예비장바구니
                  </a>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    예비수강신청
                  </a>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    예비수강신청내역
                  </a>
                  <span className='subNavSep' aria-hidden='true' />
                  <a className='subNavItem' href='#' onClick={prevent}>
                    장바구니
                  </a>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    수강신청
                  </a>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    수강신청내역
                  </a>
                  <span className='subNavSep' aria-hidden='true' />
                  <a className='subNavItem' href='#' onClick={prevent}>
                    정원 외 신청
                  </a>
                </div>
              )}
              {hoverMenu === 'mba' && (
                <div className='subNavList'>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    MBA 수강신청
                  </a>
                  <a className='subNavItem' href='#' onClick={prevent}>
                    EMBA 수강신청
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

type NoticeItem = {id: number; title: string};
const DUMMY_NOTICES: NoticeItem[] = [
  {id: 1, title: '더미 공지사항 1 (예: 수강편람 게시)'},
  {id: 2, title: '더미 공지사항 2 (예: 브라우저 캐시 삭제 안내)'},
  {id: 3, title: '더미 공지사항 3 (예: 시스템 점검 일정)'},
  {id: 4, title: '더미 공지사항 4 (예: 유의사항 안내)'},
];

function NoticePage() {
  return (
    <main className='page'>
      <div className='containerX'>
        <section className='card'>
          <div className='cardInner'>
            <div className='sectionHeadRow'>
              <h2 className='titleLine'>
                <strong className='blue'>공지사항</strong>
              </h2>
              <Link className='moreLink' to='/'>
                홈으로 ←
              </Link>
            </div>
            <div className='noticeList'>
              {DUMMY_NOTICES.map((n) => (
                <a
                  key={n.id}
                  className='noticeItem'
                  href='#'
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

function Footer() {
  return (
    <footer className='footer'>
      <div className='containerX footerInner'>
        <div className='footerLinks'>
          <a href='#' onClick={(e) => e.preventDefault()}>
            개인정보처리방침
          </a>
          <a href='#' onClick={(e) => e.preventDefault()}>
            이메일무단수집거부
          </a>
        </div>
        <div className='footerCopy'>
          Copyright (C) 2020 SEOUL NATIONAL UNIVERSITY. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
