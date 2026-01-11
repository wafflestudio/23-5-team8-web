import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {api} from '../api/axios';
import {isAxiosError} from 'axios';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (value: string): string => {
    if (value.length === 0) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return '올바른 이메일 형식이 아닙니다.';
    return '';
  };

  const validatePassword = (value: string): string => {
    if (value.length === 0) return '';
    if (value.length < 8) {
      return '비밀번호는 8글자 이상이어야 합니다.';
    }
    if (!/[a-zA-Z]/.test(value)) {
      return '비밀번호에 영어가 포함되어야 합니다.';
    }
    if (!/[0-9]/.test(value)) {
      return '비밀번호에 숫자가 포함되어야 합니다.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return '비밀번호에 특수문자가 포함되어야 합니다.';
    }
    return '';
  };

  const validateConfirmPassword = (value: string): string => {
    if (value.length === 0) return '';
    if (value !== password) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({
      ...errors,
      email: validateEmail(value),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({
      ...errors,
      password: validatePassword(value),
    });
    // 비밀번호 확인도 다시 검증
    if (confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(confirmPassword),
      }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors({
      ...errors,
      confirmPassword: validateConfirmPassword(value),
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    if (emailError || passwordError || confirmPasswordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    try {
      // Axios POST 요청
      await api.post('/api/auth/signup', {
        email,
        password,
        name,
      });

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
        alert(errorMessage);
        console.error('Register Failed:', error.response?.data);
      } else {
        console.error('Unexpected Error:', error);
      }
    }
  };

  return (
    <div className='login-page'>
      <header className='login-header'>
        <div className='login-header-content'>
          <div className='login-logo'>
            <img
              src='/assets/waffle_logo_title.png'
              alt='Waffle Logo'
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className='login-logo-text'>서울대학교 수강신청 연습</span>
          </div>
        </div>
      </header>

      <main className='login-main'>
        <div className='login-container'>
          <h1 className='login-title'>회원가입</h1>

          <form className='login-form' onSubmit={handleRegister}>
            <div className='form-group'>
              <input
                type='text'
                className='form-input'
                placeholder='이름'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className='form-group'>
              <input
                type='text'
                className='form-input'
                placeholder='이메일'
                value={email}
                onChange={handleEmailChange}
                required
              />
              {errors.email && (
                <span className='error-message'>{errors.email}</span>
              )}
            </div>

            <div className='form-group'>
              <div className='password-input-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='form-input password-input'
                  placeholder='비밀번호'
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type='button'
                  className='password-toggle'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? '/assets/hide.png' : '/assets/view.png'}
                    alt={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  />
                </button>
              </div>
              {errors.password && (
                <span className='error-message'>{errors.password}</span>
              )}
            </div>

            <div className='form-group'>
              <div className='password-input-wrapper'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className='form-input password-input'
                  placeholder='비밀번호 확인'
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <button
                  type='button'
                  className='password-toggle'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={
                      showConfirmPassword
                        ? '/assets/hide.png'
                        : '/assets/view.png'
                    }
                    alt={
                      showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                    }
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className='error-message'>{errors.confirmPassword}</span>
              )}
            </div>

            <button type='submit' className='login-button'>
              회원가입
            </button>
          </form>

          <div className='login-footer'>
            <Link to='/login' className='register-link'>
              이미 계정이 있으신가요? 로그인하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
