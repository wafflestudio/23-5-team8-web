import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  getLeaderboardApi,
  getWeeklyLeaderboardApi,
  getMyLeaderboardApi,
  getMyWeeklyLeaderboardApi,
} from '../api/leaderboard';
import { useAuth } from '../contexts/AuthContext.ts';
import type {
  LeaderboardEntryResponse,
  LeaderboardResponse,
  MyLeaderboardResponse,
} from '../types/apiTypes';
import Warning from '../utils/Warning';
import '../css/homePage.css';

type FilterType = 'all' | 'weekly';
type CategoryType = 'firstReaction' | 'secondReaction' | 'competitionRate';

const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#e0e0e0"/>
  <circle cx="50" cy="35" r="18" fill="#bdbdbd"/>
  <ellipse cx="50" cy="80" rx="30" ry="22" fill="#bdbdbd"/>
</svg>
`)}`;

const getCategoryData = (data: LeaderboardResponse, category: CategoryType) => {
  switch (category) {
    case 'firstReaction':
      return data.topFirstReactionTime;
    case 'secondReaction':
      return data.topSecondReactionTime;
    case 'competitionRate':
      return data.topCompetitionRate;
  }
};

const formatValue = (value: number, category: CategoryType): string => {
  if (category === 'competitionRate') {
    return `${value.toFixed(2)}:1`;
  }
  return `${value}ms`;
};

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotSupporting, setShowNotSupporting] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [category, setCategory] = useState<CategoryType>('firstReaction');

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard', 'home', filter],
    queryFn: async () => {
      const response =
        filter === 'all'
          ? await getLeaderboardApi({ page: 0, size: 5 })
          : await getWeeklyLeaderboardApi({ page: 0, size: 5 });
      return response.data;
    },
  });

  const { data: myData } = useQuery({
    queryKey: ['leaderboard', 'my', filter],
    queryFn: async () => {
      const response =
        filter === 'all'
          ? await getMyLeaderboardApi()
          : await getMyWeeklyLeaderboardApi();
      return response.data;
    },
    enabled: !!user,
    retry: false,
  });

  const getEntries = (): LeaderboardEntryResponse[] => {
    if (!leaderboardData) return [];
    return getCategoryData(leaderboardData, category).items.slice(0, 5);
  };

  const getMyValue = (
    myData: MyLeaderboardResponse | undefined
  ): { value: number | null; rank: number | null } => {
    if (!myData) return { value: null, rank: null };
    switch (category) {
      case 'firstReaction':
        return {
          value: myData.bestFirstReactionTime,
          rank: myData.bestFirstReactionTimeRank,
        };
      case 'secondReaction':
        return {
          value: myData.bestSecondReactionTime,
          rank: myData.bestSecondReactionTimeRank,
        };
      case 'competitionRate':
        return {
          value: myData.bestCompetitionRate,
          rank: myData.bestCompetitionRateRank,
        };
      default:
        return { value: null, rank: null };
    }
  };

  const entries = getEntries();
  const myRank = getMyValue(myData);

  return (
    <main className="page">
      <div className="containerX">
        <div className="homeGrid">
          <div className="homeLeft">
            <section className="panel periodPanel">
              <div className="panelHead">
                <div className="periodTitle">
                  <span className="periodYear blue">2026학년도 1학기</span>
                  <span className="periodText">수강신청 기간안내</span>
                </div>
                <div className="periodNote">※장바구니는 선착순이 아닙니다.</div>
              </div>
              <div className="periodBody">
                <table className="periodTable">
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
                        <td data-label="수강신청 구분">{row.category}</td>
                        <td data-label="일자">{row.date}</td>
                        <td data-label="시간">{row.time}</td>
                        <td data-label="대상" className="periodTarget">
                          {row.target}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="homeRight">
            {!user && (
              <section className="panel loginPanel">
                <div className="loginTop">
                  <div className="loginTitle blue">로그인 하세요.</div>
                  <Link className="loginBtnLink" to="/login">
                    로그인
                  </Link>
                  <div className="loginDesc">
                    본인 아이디 또는 비밀번호 찾기가 가능합니다.
                  </div>
                  <div className="loginFind">
                    <button className="findBtn" type="button">
                      아이디 찾기
                    </button>
                    <span className="findSep">/</span>
                    <button className="findBtn" type="button">
                      비밀번호 찾기
                    </button>
                  </div>
                </div>
              </section>
            )}

            <div className="rightButtons">
              <a
                className={user ? 'rightFilledBtn' : 'rightOutlineBtn'}
                href="#"
                onClick={() => setShowNotSupporting(true)}
              >
                ALLCLEAR 서비스 이용 방법 안내
              </a>
              <a
                className={user ? 'rightFilledBtn' : 'rightOutlineBtn'}
                href="https://docs.google.com/forms/d/e/1FAIpQLSediDA6u8VTTy9sAJ5VHDsUuLRQLaSJyBypCXz3EuO6kJ6IJQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                개발자에게 피드백
              </a>
            </div>

            <section className="panel leaderBoardPanel">
              <div className="panelHead">
                <div className="panelTitle">리더보드</div>
                <button
                  className="home-leaderboard-detail-btn"
                  onClick={() => navigate('/leaderboard')}
                >
                  상세보기
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="panelBody leaderBoardBody">
                <div className="home-leaderboard-filter-tabs">
                  <button
                    className={`home-leaderboard-filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    전체
                  </button>
                  <button
                    className={`home-leaderboard-filter-tab ${filter === 'weekly' ? 'active' : ''}`}
                    onClick={() => setFilter('weekly')}
                  >
                    주간
                  </button>
                </div>

                <div className="home-leaderboard-category-tabs">
                  <button
                    className={`home-leaderboard-category-tab ${category === 'firstReaction' ? 'active' : ''}`}
                    onClick={() => setCategory('firstReaction')}
                  >
                    1픽 반응속도
                  </button>
                  <button
                    className={`home-leaderboard-category-tab ${category === 'secondReaction' ? 'active' : ''}`}
                    onClick={() => setCategory('secondReaction')}
                  >
                    2픽 반응속도
                  </button>
                  <button
                    className={`home-leaderboard-category-tab ${category === 'competitionRate' ? 'active' : ''}`}
                    onClick={() => setCategory('competitionRate')}
                  >
                    경쟁률
                  </button>
                </div>

                {isLoading ? (
                  <div className="home-leaderboard-loading">로딩 중...</div>
                ) : entries.length === 0 ? (
                  <div className="home-leaderboard-empty">
                    아직 기록이 없습니다.
                  </div>
                ) : (
                  <div className="home-leaderboard-list">
                    {entries.map((entry, index) => {
                      const rank = index + 1;
                      return (
                        <div
                          key={`${entry.userId}-${index}`}
                          className={`home-leaderboard-item ${rank <= 3 ? 'top-3' : ''}`}
                        >
                          <span
                            className={`home-leaderboard-rank rank-${rank}`}
                          >
                            {rank}
                          </span>
                          <div className="home-leaderboard-user">
                            <img
                              className="home-leaderboard-avatar"
                              src={entry.profileImageUrl || DEFAULT_AVATAR}
                              alt={entry.nickname}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  DEFAULT_AVATAR;
                              }}
                            />
                            <span className="home-leaderboard-nickname">
                              {entry.nickname}
                            </span>
                          </div>
                          <span className="home-leaderboard-value">
                            {formatValue(entry.value, category)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {user ? (
                  myRank.rank !== null && myRank.value !== null ? (
                    <div className="home-leaderboard-my-rank">
                      <div className="home-leaderboard-my-rank-title">
                        내 순위
                      </div>
                      <div className="home-leaderboard-item my-rank">
                        <span className="home-leaderboard-rank">
                          {myRank.rank}
                        </span>
                        <div className="home-leaderboard-user">
                          <span className="home-leaderboard-nickname">
                            {user.nickname}
                          </span>
                        </div>
                        <span className="home-leaderboard-value">
                          {formatValue(myRank.value, category)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="home-leaderboard-my-rank">
                      <div className="home-leaderboard-my-rank-title">
                        내 순위
                      </div>
                      <div className="home-leaderboard-empty">
                        아직 기록이 없습니다.
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
      <Warning
        variant="single"
        icon="warning"
        isOpen={showNotSupporting}
        onClose={() => setShowNotSupporting(false)}
      >
        <p className="warningText">지원하지 않는 기능입니다.</p>
      </Warning>
    </main>
  );
}

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
