import React, {useState} from 'react';
import {Link} from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const validateUsername = (value: string): string => {
    if (value.length === 0) return '';
    if (value.length < 4 || value.length > 20) {
      return '아이디는 4글자 이상 20글자 이하여야 합니다.';
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return '아이디는 영어와 숫자로만 구성되어야 합니다.';
    }
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setErrors({
      ...errors,
      username: validateUsername(value),
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    if (usernameError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    console.log('회원가입 시도:', {
      name,
      username,
      password,
    });
    // 여기에 실제 회원가입 로직 추가
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
                placeholder='아이디'
                value={username}
                onChange={handleUsernameChange}
                required
              />
              {errors.username && (
                <span className='error-message'>{errors.username}</span>
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
