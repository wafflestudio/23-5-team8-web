import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import {
  useMyPageQuery,
  useUpdateProfileMutation,
  useUpdateProfileImageMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
  usePracticeSessionsQuery,
} from '../hooks/useMyPageQuery';
import type { PracticeSessionItem } from '../types/apiTypes';
import '../css/mypage.css';
import { useAuth } from '../contexts/AuthContext';

// MyPage 헤더 컴포넌트
const MyPageHeader: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  return (
    <header className="mypage-header">
      <div className="mypage-header-content">
        <Link to="/" className="mypage-logo">
          <img src="/assets/logo.png" alt="All Clear Logo" />
        </Link>
        {onLogout && (
          <button className="logout-btn" onClick={onLogout}>
            로그아웃
          </button>
        )}
      </div>
      <div className="mypage-header-gradient" />
    </header>
  );
};

// 닉네임 변경 모달
const NameChangeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
}> = ({ isOpen, onClose, currentName, onSave }) => {
  const [newName, setNewName] = useState(currentName);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>닉네임 변경</h2>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 닉네임 입력"
        />
        <div className="modal-buttons">
          <button onClick={() => onSave(newName)}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

// 비밀번호 변경 모달
const PasswordChangeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>비밀번호 변경</h2>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호 확인"
        />
        <div className="modal-buttons">
          <button
            onClick={() => {
              onSave(currentPassword, newPassword, confirmPassword);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
          >
            저장
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

// 계정 삭제 모달
const DeleteAccountModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>계정 삭제</h2>
        <p>정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
        <div className="modal-buttons">
          <button
            className="delete-button"
            onClick={() => {
              onConfirm(password);
              setPassword('');
            }}
          >
            삭제
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

// 메인 MyPage 컴포넌트
const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();

  // Queries
  const { data: myPageData, isLoading } = useMyPageQuery();
  const { data: sessionsData } = usePracticeSessionsQuery(currentPage);

  // 마이페이지 데이터 콘솔 출력
  console.log('마이페이지 데이터:', myPageData);

  // Mutations
  const updateProfileMutation = useUpdateProfileMutation();
  const updateProfileImageMutation = useUpdateProfileImageMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();
  const deleteAccountMutation = useDeleteAccountMutation();

  // 프로필 이미지 변경
  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await updateProfileImageMutation.mutateAsync(file);
        alert('프로필 이미지가 변경되었습니다.');
      } catch (error) {
        if (isAxiosError(error)) {
          alert(
            error.response?.data?.message ||
              '프로필 이미지 변경에 실패했습니다.'
          );
        }
      }
    }
  };

  // 닉네임 변경
  const handleNameChange = async (newName: string) => {
    try {
      await updateProfileMutation.mutateAsync({ nickname: newName });
      alert('닉네임이 변경되었습니다.');
      setShowNameModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '닉네임 변경에 실패했습니다.');
      }
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      alert('비밀번호가 변경되었습니다.');
      setShowPasswordModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
      }
    }
  };

  // 계정 삭제
  const handleDeleteAccount = async (password: string) => {
    try {
      await deleteAccountMutation.mutateAsync(password);
      alert('계정이 삭제되었습니다.');
      navigate('/login');
    } catch (error) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '계정 삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mypage-page">
        <MyPageHeader />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!myPageData) {
    return (
      <div className="mypage-page">
        <MyPageHeader />
        <div className="error-message">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="mypage-page">
      <MyPageHeader
        onLogout={() => {
          logout();
          navigate('/login');
        }}
      />

      <div className="mypage-container">
        {/* 프로필 섹션 */}
        <section className="profile-section">
          <h2 className="profile-title">프로필</h2>
          <div className="profile-content">
            <div className="profile-image-wrapper">
              <img
                src={myPageData.profileImageUrl || '/assets/basic_profile.png'}
                alt="Profile"
                className="profile-image"
              />
              <button
                className="profile-edit-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <img src="/assets/pencil.png" alt="Edit" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfileImageChange}
              />
            </div>
            <div className="profile-info">
              <div className="profile-name-row">
                <span className="profile-name">{myPageData.nickname}</span>
                <button
                  className="name-edit-btn"
                  onClick={() => setShowNameModal(true)}
                >
                  <img src="/assets/pencil.png" alt="Edit" />
                </button>
              </div>
              {/* MyPageResponse 타입에 email이 없으므로 제거함 */}
              {/* <div className="profile-email">
                <label>이메일</label>
                <span>{myPageData.email}</span>
              </div> */}
            </div>
          </div>
          <div className="profile-actions">
            <button
              className="profile-action-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              비밀번호 변경
            </button>
            <button
              className="profile-action-btn delete"
              onClick={() => setShowDeleteModal(true)}
            >
              계정 삭제
            </button>
          </div>
        </section>

        {/* 연습 세션 목록 조회 섹션 */}
        <section className="results-section">
          <div className="results-header">
            <h2 className="results-title">연습 세션 목록 조회</h2>
            {sessionsData &&
              sessionsData.items &&
              sessionsData.items.filter(
                (session: PracticeSessionItem) => session.totalAttempts > 0
              ).length > 3 && (
                <button
                  className="view-more-btn"
                  onClick={() => setShowAllSessions(!showAllSessions)}
                >
                  {showAllSessions ? '간단히 보기' : '더보기 +'}
                </button>
              )}
          </div>
          {!sessionsData ||
          !sessionsData.items ||
          sessionsData.items.length === 0 ? (
            <div className="results-empty">아직 연습 세션이 없습니다.</div>
          ) : (
            <>
              <div className="leaderboard-list-header">
                <span>날짜</span>
                <span>성공/시도</span>
                <span style={{ textAlign: 'right' }}>성공률</span>
              </div>
              <div className="leaderboard-list">
                {sessionsData.items
                  .filter(
                    (session: PracticeSessionItem) => session.totalAttempts > 0
                  )
                  .slice(0, showAllSessions ? undefined : 3)
                  .map((session: PracticeSessionItem) => (
                    <div
                      key={session.id}
                      className="leaderboard-item"
                      onClick={() =>
                        navigate(`/practice-session/${session.id}`)
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="leaderboard-nickname">
                        {new Date(session.practiceAt).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="leaderboard-user">
                        {session.successCount}회 / {session.totalAttempts}회
                      </span>
                      <span className="leaderboard-value">
                        {(
                          (session.successCount / session.totalAttempts) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  ))}
              </div>
              {showAllSessions && sessionsData.pageInfo.totalPages > 1 && (
                <div className="pagination">
                  {Array.from(
                    { length: sessionsData.pageInfo.totalPages },
                    (_, i) => (
                      <button
                        key={i}
                        className={currentPage === i ? 'active' : ''}
                        onClick={() => setCurrentPage(i)}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* 모달들 */}
      <NameChangeModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        currentName={myPageData?.nickname || ''}
        onSave={handleNameChange}
      />

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordChange}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default MyPage;
