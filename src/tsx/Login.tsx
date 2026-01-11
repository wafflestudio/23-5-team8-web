import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {api} from '../api/axios';
import {isAxiosError} from 'axios';
import {loginApi} from '../api/auth';

export default function Login() {
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setErrorCode(null);

    try {
      const response = await loginApi({email, password});

      const {user, accessToken} = response.data;

      login(
        {id: user.id.toString(), nickname: user.nickname},
        accessToken || ''
      );

      navigate('/');
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            // 400 Bad Request: 유효성 검사 실패
            setErrorMessage('올바른 이메일 형식이 아닙니다');
            setErrorCode(400);
            break;

          case 401:
            // 401 Unauthorized: 인증 실패
            setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다');
            setErrorCode(401);
            break;

          default:
            // 그 외 서버 에러
            setErrorMessage('로그인 중 알 수 없는 오류가 발생했습니다.');
            console.error('Login Failed:', data);
        }
      } else {
        console.error('Unexpected Error:', error);
        setErrorMessage('네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
    const mockCode = 'mock-auth-code-123';
    try {
      const response = await api.post(`/api/auth/${provider}/login`, {
        code: mockCode,
      });

      const {user, accessToken} = response.data;

      login(user);
      localStorage.setItem('authToken', accessToken);
      alert(`${provider} 로그인 성공!`);
      navigate('/');
    } catch (error) {
      console.error(`${provider} login error`, error);
      alert('소셜 로그인 실패');
    }
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
          {errorCode === 401 && (
            <div
              style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}
            >
              {errorMessage}
            </div>
          )}

          <form className='login-form' onSubmit={handleLogin}>
            <div className='form-group'>
              <input
                type='text'
                className='form-input'
                placeholder='이메일'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errorCode === 400 && (
                <span
                  style={{color: 'red', fontSize: '16px', marginLeft: '8px'}}
                >
                  {errorMessage}
                </span>
              )}
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
              onClick={() => handleSocialLogin('kakao')}
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
              onClick={() => handleSocialLogin('google')}
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
