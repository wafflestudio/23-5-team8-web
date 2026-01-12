import React, {useState, useCallback, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {isAxiosError} from 'axios';
import {loginApi, socialLoginApi, type socialProvider} from '../api/auth';

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const {login} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [socialErrorMessage, setSocialErrorMessage] = useState<string | null>(
    null
  );

  const redirectUri = `${window.location.origin}/login`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setErrorCode(null);
    setSocialErrorMessage(null);

    try {
      const response = await loginApi({email, password});

      const responseData = response.data;
      const userData =
        'user' in responseData ? responseData.user : responseData;
      const accessToken =
        'accessToken' in responseData ? responseData.accessToken : '';

      if (!userData || !('id' in userData) || !('nickname' in userData)) {
        console.error('Unexpected login response format:', responseData);
        setErrorMessage('로그인 중 알 수 없는 오류가 발생했습니다.');
        return;
      }

      login(
        {id: userData.id.toString(), nickname: userData.nickname},
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

  const handleSocialStart = (provider: socialProvider) => {
    sessionStorage.setItem('pendingSocialProvider', provider);

    if (provider === 'kakao') {
      const url = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${redirectUri}&response_type=code`;
      window.location.href = url;
    } else if (provider === 'google') {
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
      window.location.href = url;
    }
  };

  const handleSocialLogin = useCallback(
    async (provider: socialProvider, code: string) => {
      setSocialErrorMessage(null);

      try {
        const response = await socialLoginApi(provider, {code, redirectUri});
        const {user, accessToken} = response.data;

        login({id: user.id.toString(), nickname: user.nickname}, accessToken);
        // navigate('/')는 login 함수 내부나 이후 흐름에서 처리
        navigate('/');
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          const status = error.response.status;
          switch (status) {
            case 400:
              setSocialErrorMessage('입력 값이 유효하지 않습니다.');
              break;
            case 401:
              setSocialErrorMessage('소셜 인증에 실패했습니다.');
              break;
            default:
              setSocialErrorMessage(
                '소셜 로그인 중 알 수 없는 오류가 발생했습니다.'
              );
              console.error('Social Login Failed:', error.response.data);
          }
        } else {
          console.error('Unexpected Error:', error);
          setSocialErrorMessage('네트워크 오류가 발생했습니다.');
        }
      } finally {
        // 처리가 끝나면 임시 저장 데이터 삭제 및 URL 정리
        sessionStorage.removeItem('pendingSocialProvider');
      }
    },
    [login, navigate, redirectUri]
  );

  // 인증 코드로 돌아왔을 때 소셜 로그인 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    // 이전에 어떤 버튼을 눌렀는지 확인
    const provider = sessionStorage.getItem(
      'pendingSocialProvider'
    ) as socialProvider | null;

    if (code && provider) {
      // 코드가 있고, 진행 중인 provider가 있다면 로그인 시도
      handleSocialLogin(provider, code);

      // 재요청 방지를 위해 URL의 쿼리 파라미터 제거 (선택 사항)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, handleSocialLogin]);

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
            {socialErrorMessage && (
              <div
                style={{
                  color: 'red',
                  marginBottom: '10px',
                  textAlign: 'center',
                }}
              >
                {socialErrorMessage}
              </div>
            )}
            <button
              className='kakao-login-button'
              onClick={() => handleSocialStart('kakao')}
            >
              <div className='kakao-icon-wrapper'>
                <img src='/assets/kakao_logo.png' alt='Kakao Symbol' />
              </div>
              <span className='kakao-label'>Login with Kakao</span>
            </button>
            <button
              className='gsi-material-button'
              onClick={() => handleSocialStart('google')}
            >
              <div className='gsi-material-button-state'></div>
              <div className='gsi-material-button-content-wrapper'>
                <div className='gsi-material-button-icon'>
                  <svg
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 48 48'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                    style={{display: 'block'}}
                  >
                    <path
                      fill='#EA4335'
                      d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                    ></path>
                    <path
                      fill='#4285F4'
                      d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                    ></path>
                    <path
                      fill='#FBBC05'
                      d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                    ></path>
                    <path
                      fill='#34A853'
                      d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                    ></path>
                    <path fill='none' d='M0 0h48v48H0z'></path>
                  </svg>
                </div>
                <span className='gsi-material-button-contents'>
                  Sign in with Google
                </span>
                <span style={{display: 'none'}}>Sign in with Google</span>
              </div>
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
