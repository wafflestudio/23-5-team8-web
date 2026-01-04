import React from 'react';
import {Link} from 'react-router-dom';
import './homePage.css';

export default function HomePage() {
  return (
    <main className='page'>
      <div className='containerX'>
        {/* leftCol, rightCol을 제거하고 바로 패널들을 배치 (Flatten) */}
        <div className='homeGrid'>
          {/* 1. 기간안내 패널 */}
          <section className='panel periodPanel'>
            <div className='panelHead'>
              <div className='periodTitle'>
                <span className='periodYear blue'>2025학년도 겨울학기</span>
                <span className='periodText'>수강신청 기간안내</span>
              </div>
              <div className='periodNote'>※장바구니는 선착순이 아닙니다.</div>
            </div>
            <div className='periodBody'>
              <table className='periodTable'>
                <thead>
                  <tr>
                    <th>수강신청 구분</th>
                    <th>일자</th>
                    <th>시간</th>
                    <th>대상</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label='수강신청 구분'>수강취소(개강후)</td>
                    <td data-label='일자'>2025-12-22(월) ~ 2026-01-08(목)</td>
                    <td data-label='시간'>00:00~23:59</td>
                    <td data-label='대상' className='periodTarget'>
                      2/3 환불(~1/3), 1/2 환불(~1/8)
                      <br />
                      메뉴:mySNU- 학사정보-수업-계절학기수강취소/환불
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. 수강안내 패널 */}
          <section className='panel infoPanel'>
            <div className='panelHead'>
              <div className='panelTitle'>사이트안내</div>
            </div>
            <div className='panelBody'>
              <div className='infoLineBold'>내용을 채워 넣읍시다.</div>
            </div>
          </section>

          {/* 3. 로그인 패널 */}
          <section className='panel loginPanel'>
            <div className='loginTop'>
              <div className='loginTitle blue'>로그인 하세요.</div>
              <Link className='loginBtnLink' to='/login'>
                로그인
              </Link>
              <div className='loginDesc'>
                본인 아이디 또는 비밀번호 찾기가 가능합니다.
              </div>
              <div className='loginFind'>
                <button className='findBtn' type='button'>
                  아이디 찾기
                </button>
                <span className='findSep'>/</span>
                <button className='findBtn' type='button'>
                  비밀번호 찾기
                </button>
              </div>
            </div>
          </section>

          {/* 4. 우측 버튼 2개 */}
          <div className='rightButtons'>
            <a
              className='rightOutlineBtn'
              href='#'
              onClick={(e) => e.preventDefault()}
            >
              장바구니 초보를 위한 수강신청 안내 →
            </a>
            <a
              className='rightOutlineBtn'
              href='#'
              onClick={(e) => e.preventDefault()}
            >
              수강신청방법 매뉴얼 ↓
            </a>
          </div>

          {/* 5. 공지사항 패널 */}
          <section className='panel noticePanel'>
            <div className='noticeHead'>
              <div className='panelTitle'>공지사항</div>
              <Link className='noticeMore' to='/notice'>
                더보기
              </Link>
            </div>
            <div className='panelBody'>
              {DUMMY_NOTICES.slice(0, 4).map((n) => (
                <Link key={n.id} to='/notice' className='noticeRow'>
                  {n.title}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

type NoticeItem = {id: number; title: string};

const DUMMY_NOTICES: NoticeItem[] = [
  {id: 1, title: '더미 공지사항 1 (예: 수강편람 게시)'},
  {id: 2, title: '더미 공지사항 2 (예: 브라우저 캐시 삭제 안내)'},
  {id: 3, title: '더미 공지사항 3 (예: 시스템 점검 일정)'},
  {id: 4, title: '더미 공지사항 4 (예: 유의사항 안내)'},
];
