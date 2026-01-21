import {Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext.ts';
import '../css/homePage.css';
import NotSupporting from '../utils/notSupporting.tsx';
import {useState} from 'react';

export default function HomePage() {
  const {user} = useAuth();
  const [showNotSupporting, setShowNotSupporting] = useState(false);

  return (
    <main className='page'>
      <div className='containerX'>
        {/* [구조 변경] Grid 컨테이너 안에 Left/Right 컬럼을 나눔 */}
        <div className='homeGrid'>
          {/* [왼쪽 컬럼] 기간안내 + 수강안내 */}
          <div className='homeLeft'>
            <section className='panel periodPanel'>
              <div className='panelHead'>
                <div className='periodTitle'>
                  <span className='periodYear blue'>2026학년도 1학기</span>
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
                    {SCHEDULE_DATA.map((row, index) => (
                      <tr key={index}>
                        <td data-label='수강신청 구분'>{row.category}</td>
                        <td data-label='일자'>{row.date}</td>
                        <td data-label='시간'>{row.time}</td>
                        <td data-label='대상' className='periodTarget'>
                          {row.target}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className='panel infoPanel'>
              <div className='panelHead'>
                <div className='panelTitle'>사이트안내</div>
              </div>
              <div className='panelBody'>
                <div className='infoLineBold'>
                  수강신청 관련 주요 안내사항이 표시됩니다.
                </div>
                <div className='infoLine'>로그인이 필요합니다.</div>
              </div>
            </section>
          </div>

          {/* [오른쪽 컬럼] 로그인(조건부) + 버튼들 + 공지사항 */}
          {/* Flex Column으로 쌓이므로 로그인 패널 없으면 나머지가 위로 붙음 */}
          <div className='homeRight'>
            {!user && (
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
            )}

            <div className='rightButtons'>
              <a
                className={user ? 'rightFilledBtn' : 'rightOutlineBtn'}
                href='#'
                onClick={() => setShowNotSupporting(true)}
              >
                ALLCLEAR 서비스 이용 방법 안내
              </a>
              <a
                className={user ? 'rightFilledBtn' : 'rightOutlineBtn'}
                href='https://docs.google.com/forms/d/e/1FAIpQLSediDA6u8VTTy9sAJ5VHDsUuLRQLaSJyBypCXz3EuO6kJ6IJQ/viewform'
                target='_blank'
                rel='noopener noreferrer'
              >
                개발자에게 피드백
              </a>
            </div>

            <section className='panel noticePanel'>
              <div className='noticeHead'>
                <div className='panelTitle'>공지사항</div>
                <Link className='noticeMore' to='/notice'>
                  더보기
                </Link>
              </div>
              <div className='panelBody noticeBody'>
                {DUMMY_NOTICES.slice(0, 4).map((n) => (
                  <Link key={n.id} to='/notice' className='noticeRow'>
                    {n.title}
                  </Link>
                ))}
              </div>
            </section>
            <section className='panel LeaderBoardPanel'>
              <div className='panelHead'>
                <div className='panelTitle'>리더보드</div>
              </div>
              <div className='panelBody leaderBoardBody'>
                리더보드 기능은 곧 업데이트될 예정입니다!
              </div>
            </section>
          </div>
        </div>
      </div>
      <NotSupporting
        isOpen={showNotSupporting}
        onClose={() => setShowNotSupporting(false)}
      />
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

const SCHEDULE_DATA = [
  {
    category: '예비장바구니 신청',
    date: '2026-01-20(화) ~ 2026-01-20(화)',
    time: '09:00 ~ 16:00',
    target: '재·휴학생 전체\n(국내학점교류 제외)',
  },
  {
    category: '예비장바구니 전산확정',
    date: '2026-01-21(수) ~ 2026-01-21(수)',
    time: '09:00 ~ 18:00',
    target: '학사과 전산확정',
  },
  {
    category: '예비선착순수강신청\n(1일차)',
    date: '2026-01-22(목) ~ 2026-01-22(목)',
    time: '08:30 ~ 16:30',
    target: '재·휴학생\n(선착순수강1일)',
  },
  {
    category: '예비선착순수강신청\n(2일차)',
    date: '2026-01-23(금) ~ 2026-01-23(금)',
    time: '08:30 ~ 16:30',
    target: '재·휴학생\n(선착순수강2일)',
  },
  {
    category: '장바구니신청(1일차)',
    date: '2026-01-27(화) ~ 2026-01-27(화)',
    time: '09:00 ~ 23:59',
    target: '재·휴학생\n(국내학점교류생 제외)',
  },
  {
    category: '장바구니신청(2일차)',
    date: '2026-01-28(수) ~ 2026-01-28(수)',
    time: '00:00 ~ 16:00',
    target: '재·휴학생\n(국내학점교류생 제외)',
  },
  {
    category: '장바구니 전산확정',
    date: '2026-01-29(목) ~ 2026-01-29(목)',
    time: '09:00 ~ 18:00',
    target: '학사과 전산확정',
  },
  {
    category: '선착순수강신청(1일차)',
    date: '2026-01-30(금) ~ 2026-01-30(금)',
    time: '08:30 ~ 16:30',
    target: '재·휴학생\n(국내학점교류생 포함)\n(선착순수강1일)',
  },
  {
    category: '선착순수강신청(2일차)',
    date: '2026-02-02(월) ~ 2026-02-02(월)',
    time: '08:30 ~ 16:30',
    target: '재·휴학생\n(국내학점교류생 포함)\n(선착순수강2일)',
  },
  {
    category: '선착순수강신청(3일차)',
    date: '2026-02-03(화) ~ 2026-02-03(화)',
    time: '08:30 ~ 16:30',
    target: '재·휴학생\n(국내학점교류생 포함)\n(선착순수강3일)',
  },
  {
    category: '신입생예비장바구니신청',
    date: '2026-02-10(화) ~ 2026-02-10(화)',
    time: '09:00 ~ 16:00',
    target: '신·편입생',
  },
  {
    category: '신입생예비장바구니전산확정',
    date: '2026-02-11(수) ~ 2026-02-11(수)',
    time: '00:00 ~ 23:59',
    target: '학사과 전산확정',
  },
  {
    category: '신입생예비선착순수강신청(1일 차)',
    date: '2026-02-12(목) ~ 2026-02-12(목)',
    time: '08:30 ~ 16:30',
    target: '신·편입생\n(선착순수강1일)',
  },
  {
    category: '신입생예비선착순수강신청(2일 차)',
    date: '2026-02-13(금) ~ 2026-02-13(금)',
    time: '08:30 ~ 16:30',
    target: '신·편입생\n(선착순수강2일)',
  },
  {
    category: '신입생장바구니신청\n(1일 차)',
    date: '2026-02-19(목) ~ 2026-02-19(목)',
    time: '09:00 ~ 23:59',
    target: '신·편입생',
  },
  {
    category: '신입생장바구니신청\n(2일 차)',
    date: '2026-02-20(금) ~ 2026-02-20(금)',
    time: '00:00 ~ 16:00',
    target: '신·편입생',
  },
  {
    category: '신입생장바구니전산확정',
    date: '2026-02-23(월) ~ 2026-02-23(월)',
    time: '09:00 ~ 18:00',
    target: '학사과 전산확정',
  },
  {
    category: '신입생선착순수강신청\n(1일 차)',
    date: '2026-02-24(화) ~ 2026-02-24(화)',
    time: '08:30 ~ 16:30',
    target: '신·편입생\n(선착순수강1일)',
  },
  {
    category: '신입생선착순수강신청\n(2일 차)',
    date: '2026-02-25(수) ~ 2026-02-25(수)',
    time: '08:30 ~ 16:30',
    target: '신·편입생\n(선착순수강2일)',
  },
  {
    category: '수강신청변경(개강전)',
    date: '2026-02-26(목) ~ 2026-02-26(목)',
    time: '09:00 ~ 18:30',
    target: '전체 학생',
  },
  {
    category: '수강신청변경(개강전)',
    date: '2026-02-27(금) ~ 2026-02-27(금)',
    time: '09:00 ~ 18:30',
    target: '전체 학생',
  },
  {
    category: '수강신청변경',
    date: '2026-03-03(화) ~ 2026-03-03(화)',
    time: '09:00 ~ 18:30',
    target: '전체 학생',
  },
  {
    category: '정원외신청(교원승인)',
    date: '2026-03-03(화) ~ 2026-03-10(화)',
    time: '08:30 ~ 23:59',
    target: '교원승인:~3. 10.',
  },
  {
    category: '정원외신청\n(학생수강확정)',
    date: '2026-03-03(화) ~ 2026-03-11(수)',
    time: '08:30 ~ 23:59',
    target: '학생수강확정:~3.11.',
  },
  {
    category: '정원외신청(학생신청)',
    date: '2026-03-03(화) ~ 2026-03-09(월)',
    time: '08:30 ~ 23:59',
    target: '학생 신청: ~3. 9.',
  },
  {
    category: '수강신청변경',
    date: '2026-03-04(수) ~ 2026-03-04(수)',
    time: '09:00 ~ 18:30',
    target: '전체 학생',
  },
  {
    category: '수강신청변경',
    date: '2026-03-05(목) ~ 2026-03-05(목)',
    time: '09:00 ~ 18:30',
    target: '전체 학생',
  },
  {
    category: '수강신청변경',
    date: '2026-03-06(금) ~ 2026-03-06(금)',
    time: '09:00 ~ 18:30',
    target: '전체 학생',
  },
  {
    category: '수강신청변경',
    date: '2026-03-09(월) ~ 2026-03-09(월)',
    time: '09:00 ~ 23:59',
    target: '전체 학생\n* 마지막날 한정으로 24시까지 운영',
  },
  {
    category: '수강취소기간',
    date: '2026-03-10(화) ~ 2026-04-21(화)',
    time: '00:00 ~ 23:59',
    target:
      '마감:~4.21.(화)(메뉴: mySNU-학사정보-수업-정규학기수강취소)※ 4.1.(수) 18:00 ~ 4.2.(목) 10:00까지 일시중단 (고등교육통계조사 자료생성)',
  },
];
