import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { WarningModal } from '@shared/ui/Warning';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordChangeModal({
  isOpen,
  onClose,
}: PasswordChangeModalProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다';
    }
    if (!/[a-zA-Z]/.test(value)) {
      return '영문자를 포함해야 합니다';
    }
    if (!/[0-9]/.test(value)) {
      return '숫자를 포함해야 합니다';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return '특수문자를 포함해야 합니다';
    }
    return true;
  };

  const onSubmit = async () => {
    // Mock: 성공 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowSuccessAlert(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessAlert(false);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="admin-modal-backdrop" onClick={handleClose}>
        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
          <div className="password-modal-content">
            <h2 className="password-modal-title">비밀번호 변경</h2>

            <form className="password-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="password-form-group">
                <label className="password-form-label">현재 비밀번호</label>
                <div className="password-form-input-wrapper">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className={`password-form-input ${errors.currentPassword ? 'error' : ''}`}
                    placeholder="현재 비밀번호를 입력하세요"
                    {...register('currentPassword', {
                      required: '현재 비밀번호를 입력해주세요',
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <img
                      src={
                        showCurrentPassword
                          ? '/assets/hide.png'
                          : '/assets/view.png'
                      }
                      alt={showCurrentPassword ? '숨기기' : '보기'}
                    />
                  </button>
                </div>
                {errors.currentPassword && (
                  <span className="password-form-error">
                    {errors.currentPassword.message}
                  </span>
                )}
              </div>

              <div className="password-form-group">
                <label className="password-form-label">새 비밀번호</label>
                <div className="password-form-input-wrapper">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className={`password-form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="새 비밀번호를 입력하세요"
                    {...register('newPassword', {
                      required: '새 비밀번호를 입력해주세요',
                      validate: validatePassword,
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <img
                      src={
                        showNewPassword ? '/assets/hide.png' : '/assets/view.png'
                      }
                      alt={showNewPassword ? '숨기기' : '보기'}
                    />
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="password-form-error">
                    {errors.newPassword.message}
                  </span>
                )}
                <span className="password-requirements">
                  8자 이상, 영문/숫자/특수문자 포함
                </span>
              </div>

              <div className="password-form-group">
                <label className="password-form-label">비밀번호 확인</label>
                <div className="password-form-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`password-form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    {...register('confirmPassword', {
                      required: '비밀번호 확인을 입력해주세요',
                      validate: (value) =>
                        value === newPassword ||
                        '비밀번호가 일치하지 않습니다',
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <img
                      src={
                        showConfirmPassword
                          ? '/assets/hide.png'
                          : '/assets/view.png'
                      }
                      alt={showConfirmPassword ? '숨기기' : '보기'}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="password-form-error">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <div className="password-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleClose}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '변경 중...' : '변경하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <WarningModal.Alert
        isOpen={showSuccessAlert}
        onClose={handleSuccessClose}
        title="비밀번호 변경 완료"
        subtitle="비밀번호가 성공적으로 변경되었습니다."
        confirmLabel="확인"
      />
    </>
  );
}
