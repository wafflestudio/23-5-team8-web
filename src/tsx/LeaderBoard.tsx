import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {isAxiosError} from 'axios';
import {useAuth} from '../contexts/AuthContext';
import {
  getLeaderboardApi,
  getWeeklyLeaderboardApi,
  getMyLeaderboardApi,
  getMyWeeklyLeaderboardApi,
} from '../api/leaderboard';
import type {
  LeaderboardEntryResponse,
  LeaderboardResponse,
  MyLeaderboardResponse,
} from '../types/apiTypes';
import '../css/leaderBoard.css';

type FilterType = 'all' | 'weekly';
type CategoryType = 'firstReaction' | 'secondReaction' | 'competitionRate';

const INITIAL_LIMIT = 10;

// Default avatar SVG - simple gray human silhouette
const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#e0e0e0"/>
  <circle cx="50" cy="35" r="18" fill="#bdbdbd"/>
  <ellipse cx="50" cy="80" rx="30" ry="22" fill="#bdbdbd"/>
</svg>
`)}`;
const LOAD_MORE_COUNT = 10;

export default function LeaderBoard() {
  const navigate = useNavigate();
  const {user} = useAuth();

  const [filter, setFilter] = useState<FilterType>('all');
  const [category, setCategory] = useState<CategoryType>('firstReaction');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
  const [myData, setMyData] = useState<MyLeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [hasMore, setHasMore] = useState(true);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const leaderboardPromise =
          filter === 'all'
            ? getLeaderboardApi(limit)
            : getWeeklyLeaderboardApi(limit);

        const [leaderboardRes] = await Promise.all([leaderboardPromise]);
        setLeaderboardData(leaderboardRes.data);

        // Check if there's more data to load (use first reaction time as reference)
        const entriesCount = leaderboardRes.data.topFirstReactionTime.length;
        setHasMore(entriesCount >= limit);
      } catch (error) {
        console.error('[LeaderBoard] Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, limit]);

  // Fetch my rank data separately (requires auth)
  useEffect(() => {
    const fetchMyData = async () => {
      if (!user) {
        setMyData(null);
        return;
      }

      try {
        const myDataPromise =
          filter === 'all' ? getMyLeaderboardApi() : getMyWeeklyLeaderboardApi();
        const myRes = await myDataPromise;
        setMyData(myRes.data);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          setMyData(null);
        } else {
          console.error('[LeaderBoard] Failed to fetch my rank:', error);
        }
      }
    };

    fetchMyData();
  }, [filter, user]);

  // Reset limit when filter changes
  useEffect(() => {
    setLimit(INITIAL_LIMIT);
    setHasMore(true);
  }, [filter]);

  const getCurrentEntries = (data: LeaderboardResponse | null): LeaderboardEntryResponse[] => {
    if (!data) return [];
    switch (category) {
      case 'firstReaction':
        return data.topFirstReactionTime;
      case 'secondReaction':
        return data.topSecondReactionTime;
      case 'competitionRate':
        return data.topCompetitionRate;
      default:
        return [];
    }
  };

  const getMyValue = (): {value: number | null; rank: number | null} => {
    if (!myData) return {value: null, rank: null};
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
        return {value: null, rank: null};
    }
  };

  const formatValue = (value: number, cat: CategoryType): string => {
    if (cat === 'competitionRate') {
      return `${value.toFixed(2)}:1`;
    }
    return `${value}ms`;
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setLimit((prev) => prev + LOAD_MORE_COUNT);
  };

  useEffect(() => {
    if (loadingMore && !loading) {
      setLoadingMore(false);
    }
  }, [loading, loadingMore]);

  const entries = getCurrentEntries(leaderboardData);
  const myRank = getMyValue();

  return (
    <div className="containerX">
      <div className="leaderboard-page">
        <h1 className="leaderboard-title">리더보드</h1>

        {/* Filter Tabs */}
        <div className="leaderboard-filter-tabs">
          <button
            className={`leaderboard-filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`leaderboard-filter-tab ${filter === 'weekly' ? 'active' : ''}`}
            onClick={() => setFilter('weekly')}
          >
            주간
          </button>
        </div>

        {/* Category Tabs */}
        <div className="leaderboard-category-tabs">
          <button
            className={`leaderboard-category-tab ${category === 'firstReaction' ? 'active' : ''}`}
            onClick={() => setCategory('firstReaction')}
          >
            1픽 반응속도
          </button>
          <button
            className={`leaderboard-category-tab ${category === 'secondReaction' ? 'active' : ''}`}
            onClick={() => setCategory('secondReaction')}
          >
            2픽 반응속도
          </button>
          <button
            className={`leaderboard-category-tab ${category === 'competitionRate' ? 'active' : ''}`}
            onClick={() => setCategory('competitionRate')}
          >
            경쟁률
          </button>
        </div>

        {/* Leaderboard Container */}
        <div className="leaderboard-container">
          {/* List Header */}
          <div className="leaderboard-list-header">
            <span>순위</span>
            <span>유저</span>
            <span style={{textAlign: 'right'}}>
              {category === 'competitionRate' ? '경쟁률' : '반응속도'}
            </span>
          </div>

          {/* List */}
          {loading ? (
            <div className="leaderboard-loading">
              <div className="leaderboard-loading-spinner" />
              <p>로딩 중...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="leaderboard-empty">
              <p>아직 기록이 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="leaderboard-list">
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  return (
                    <div
                      key={`${entry.userId}-${index}`}
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
                      <div className="leaderboard-user">
                        <img
                          className="leaderboard-avatar"
                          src={entry.profileImageUrl || DEFAULT_AVATAR}
                          alt={entry.nickname}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                          }}
                        />
                        <span className="leaderboard-nickname">{entry.nickname}</span>
                      </div>
                      <span className="leaderboard-value">
                        {formatValue(entry.value, category)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="leaderboard-load-more">
                  <button
                    className="leaderboard-load-more-btn"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? '로딩 중...' : '더 보기'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* My Rank Section */}
        {user ? (
          myRank.rank !== null && myRank.value !== null ? (
            <div className="leaderboard-my-rank">
              <div className="leaderboard-my-rank-title">내 순위</div>
              <div className="leaderboard-my-rank-item">
                <span className="leaderboard-rank">{myRank.rank}</span>
                <div className="leaderboard-user">
                  <span className="leaderboard-nickname">{user.nickname}</span>
                </div>
                <span className="leaderboard-value">
                  {formatValue(myRank.value, category)}
                </span>
              </div>
            </div>
          ) : (
            <div className="leaderboard-my-rank">
              <div className="leaderboard-my-rank-title">내 순위</div>
              <div className="leaderboard-empty" style={{padding: '20px'}}>
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
