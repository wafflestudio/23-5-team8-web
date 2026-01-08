import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext.tsx';

export default function Login() {
  const {login} = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ============================================
    // 더미 데이터
    // ============================================
    const DUMMY_USERNAME = 'test1234';
    const DUMMY_PASSWORD = 'test1234!';

    if (username === DUMMY_USERNAME && password === DUMMY_PASSWORD) {
      // 로그인 성공
      const authToken = 'dummy-auth-token-' + Date.now();
      const userInfo = {
        username: username,
        name: '김와플',
        studentId: '2026-12345',
        loginTime: new Date().toISOString(),
      };

      login(userInfo);

      // localStorage에 인증 정보 저장
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      alert('로그인 성공!');
      console.log('로그인 성공:', userInfo);
      navigate('/');

      // 나중에 메인 페이지로 리다이렉트 추가 가능
      // navigate('/main');
    } else {
      // 로그인 실패
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      console.log('로그인 실패');
    }
    // ============================================
    // ============================================
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 로그인`);
  };

  return (
    <div className='login-page'>
      <header className='login-header'>
        <div className='login-header-content'>
          <Link to='/' className='login-logo'>
            <img
              src='/assets/waffle_logo_title.png'
              alt='Waffle Logo'
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className='login-logo-text'>서울대학교 수강신청 연습</span>
          </Link>
        </div>
      </header>

      <main className='login-main'>
        <div className='login-container'>
          <h1 className='login-title'>아이디 로그인</h1>

          <form className='login-form' onSubmit={handleLogin}>
            <div className='form-group'>
              <input
                type='text'
                className='form-input'
                placeholder='아이디'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className='form-group'>
              <div className='password-input-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='form-input password-input'
                  placeholder='비밀번호 입력'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className='form-checkbox'>
              <label>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>아이디 저장</span>
              </label>
            </div>

            <button type='submit' className='login-button'>
              로그인
            </button>
          </form>

          <div className='social-login'>
            <button
              className='social-login-button kakao'
              onClick={() => handleSocialLogin('카카오')}
            >
              <img
                src='/assets/kakao_logo.png'
                alt='Kakao'
                className='social-icon'
              />
              카카오로 로그인하기
            </button>
            <button
              className='social-login-button google'
              onClick={() => handleSocialLogin('구글')}
            >
              <img
                src='/assets/google_logo.png'
                alt='Google'
                className='social-icon'
              />
              구글 아이디로 로그인하기
            </button>
          </div>

          <div className='login-footer'>
            <Link to='/register' className='register-link'>
              회원가입하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
