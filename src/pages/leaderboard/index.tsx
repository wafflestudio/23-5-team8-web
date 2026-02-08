import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@features/auth';
import {
  useLeaderboardInfiniteQuery,
  useMyLeaderboardQuery,
} from '@features/leaderboard';
import { useMyPageQuery } from '@entities/user';
import type { LeaderboardEntryResponse } from '@features/leaderboard';
import { DEFAULT_AVATAR } from '@shared/lib/defaultAvatar';
import './leaderboard.css';

type FilterType = 'all' | 'weekly';
type CategoryType = 'firstReaction' | 'secondReaction' | 'competitionRate';

export default function LeaderBoard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filter = (searchParams.get('filter') as FilterType) || 'all';
  const category =
    (searchParams.get('category') as CategoryType) || 'firstReaction';

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useLeaderboardInfiniteQuery(filter, category);
  const { data: myData } = useMyLeaderboardQuery(filter, !!user);
  const { data: myProfile } = useMyPageQuery();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const triggerElement = loadMoreRef.current;

    if (!scrollContainer || !triggerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollContainer,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0,
      }
    );

    observer.observe(triggerElement);

    return () => {
      observer.unobserve(triggerElement);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const setFilter = (newFilter: FilterType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('filter', newFilter);
    setSearchParams(newParams);
  };

  const setCategory = (newCategory: CategoryType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', newCategory);
    setSearchParams(newParams);
  };

  const entries: LeaderboardEntryResponse[] = data?.pages
    ? data.pages
        .flatMap((page) => page.categoryData.items)
        .filter(
          (entry, index, self) =>
            self.findIndex((e) => e.userId === entry.userId) === index
        )
    : [];

  const getMyValue = (): { value: number | null; rank: number | null } => {
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

  const formatValue = (value: number, cat: CategoryType): string => {
    if (cat === 'competitionRate') {
      return `${value.toFixed(2)}:1`;
    }
    return `${value}ms`;
  };

  const myRank = getMyValue();

  return (
    <div className="containerX">
      <div className="leaderboard-page">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">리더보드</h1>
          <div className="leaderboard-filter-tabs" role="tablist">
            <button
              className={`leaderboard-filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
              role="tab"
              aria-selected={filter === 'all'}
            >
              전체
            </button>
            <button
              className={`leaderboard-filter-tab ${filter === 'weekly' ? 'active' : ''}`}
              onClick={() => setFilter('weekly')}
              role="tab"
              aria-selected={filter === 'weekly'}
            >
              주간
            </button>
          </div>
        </div>

        <div className="leaderboard-category-tabs">
          <button
            className={`leaderboard-category-tab ${category === 'firstReaction' ? 'active' : ''}`}
            onClick={() => setCategory('firstReaction')}
            role="tab"
            aria-selected={category === 'firstReaction'}
          >
            1픽 반응속도
          </button>
          <button
            className={`leaderboard-category-tab ${category === 'secondReaction' ? 'active' : ''}`}
            onClick={() => setCategory('secondReaction')}
            role="tab"
            aria-selected={category === 'secondReaction'}
          >
            2픽 반응속도
          </button>
          <button
            className={`leaderboard-category-tab ${category === 'competitionRate' ? 'active' : ''}`}
            onClick={() => setCategory('competitionRate')}
            role="tab"
            aria-selected={category === 'competitionRate'}
          >
            경쟁률
          </button>
        </div>

        <div className="leaderboard-container">
          <div className="leaderboard-list-header">
            <span className="leaderboard-rank">순위</span>
            <span className="leaderboard-user tab">유저</span>
            <span className="leaderboard-value">
              {category === 'competitionRate' ? '경쟁률' : '반응속도'}
            </span>
          </div>

          {isLoading ? (
            <div className="leaderboard-loading">
              <div className="leaderboard-loading-spinner" />
              <p>로딩 중...</p>
            </div>
          ) : isError ? (
            <div className="leaderboard-empty">
              <p>리더보드를 불러올 수 없습니다.</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="leaderboard-empty">
              <p>아직 기록이 없습니다.</p>
            </div>
          ) : (
            <div ref={scrollContainerRef} className="leaderboard-list">
              {entries.map((entry) => {
                const rank = entry.rank;
                const isTop3 = rank <= 3;
                return (
                  <div
                    key={`${entry.userId}-${entry.rank}`}
                    className={`leaderboard-item ${isTop3 ? 'top-3' : ''}`}
                  >
                    <span
                      className={`leaderboard-rank ${
                        rank === 1
                          ? 'leaderboard-rank-1'
                          : rank === 2
                            ? 'leaderboard-rank-2'
                            : rank === 3
                              ? 'leaderboard-rank-3'
                              : ''
                      }`}
                    >
                      {rank}
                    </span>
                    <div className="leaderboard-user alignment">
                      <img
                        className="leaderboard-avatar"
                        src={entry.profileImageUrl || DEFAULT_AVATAR}
                        alt={entry.nickname}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            DEFAULT_AVATAR;
                        }}
                      />
                      <span className="leaderboard-nickname">
                        {entry.nickname}
                      </span>
                    </div>
                    <span className="leaderboard-value">
                      {formatValue(entry.value, category)}
                    </span>
                  </div>
                );
              })}

              <div ref={loadMoreRef} className="leaderboard-scroll-trigger">
                {isFetchingNextPage && (
                  <div className="leaderboard-loading-more">
                    <div className="leaderboard-loading-spinner-small" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {user ? (
          myRank.rank !== null && myRank.value !== null ? (
            <div className="leaderboard-my-rank">
              <div className="leaderboard-my-rank-title">내 순위</div>
              <div className="leaderboard-my-rank-item">
                <span className="leaderboard-rank">{myRank.rank}</span>
                <div className="leaderboard-user">
                  <img
                    className="leaderboard-avatar"
                    src={myProfile?.profileImageUrl || DEFAULT_AVATAR}
                    alt={myProfile?.nickname || user.nickname}
                    width={36}
                    height={36}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        DEFAULT_AVATAR;
                    }}
                  />
                  <span className="leaderboard-nickname">
                    {myProfile?.nickname || user.nickname}
                  </span>
                </div>
                <span className="leaderboard-value">
                  {formatValue(myRank.value, category)}
                </span>
              </div>
            </div>
          ) : (
            <div className="leaderboard-my-rank">
              <div className="leaderboard-my-rank-title">내 순위</div>
              <div className="leaderboard-empty" style={{ padding: '20px' }}>
                아직 기록이 없습니다. 수강신청 연습을 해보세요!
              </div>
            </div>
          )
        ) : (
          <div className="leaderboard-login-required">
            <span className="leaderboard-login-text">
              로그인하면 내 순위를 확인할 수 있습니다.
            </span>
            <button
              className="leaderboard-login-btn"
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
