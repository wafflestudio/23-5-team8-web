import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {signupApi} from '../api/auth';
import {isAxiosError} from 'axios';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setGlobalError(null);

    try {
      await signupApi({
        email: data.email,
        password: data.password,
        nickname: data.name,
      });

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        switch (status) {
          case 409:
            setError('email', {message: '이미 사용 중인 이메일입니다.'});
            break;

          case 400:
            if (responseData.validationErrors) {
              if (responseData.validationErrors.email) {
                setError('email', {message: responseData.validationErrors.email});
              }
              if (responseData.validationErrors.password) {
                setError('password', {message: responseData.validationErrors.password});
              }
              if (responseData.validationErrors.nickname) {
                setError('name', {message: responseData.validationErrors.nickname});
              }
            } else {
              setGlobalError(responseData.message || '입력 정보를 확인해주세요.');
            }
            break;

          default:
            setGlobalError('회원가입 중 알 수 없는 오류가 발생했습니다.');
            console.error('[Register] Register Failed:', responseData);
        }
      } else {
        setGlobalError('네트워크 오류가 발생했습니다.');
        console.error('[Register] Unexpected Error:', error);
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

          {globalError && (
            <div
              style={{
                color: 'red',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {globalError}
            </div>
          )}

          <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-group'>
              <input
                type='text'
                className='form-input'
                placeholder='이름'
                {...register('name', {
                  required: '이름을 입력해주세요.',
                })}
              />
              {errors.name && <span className='error-message'>{errors.name.message}</span>}
            </div>

            <div className='form-group'>
              <input
                type='text'
                className='form-input'
                placeholder='이메일'
                {...register('email', {
                  required: '이메일을 입력해주세요.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '올바른 이메일 형식이 아닙니다.',
                  },
                })}
              />
              {errors.email && <span className='error-message'>{errors.email.message}</span>}
            </div>

            <div className='form-group'>
              <div className='password-input-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='form-input password-input'
                  placeholder='비밀번호'
                  {...register('password', {
                    required: '비밀번호를 입력해주세요.',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 8글자 이상이어야 합니다.',
                    },
                    validate: {
                      hasLetter: (value) =>
                        /[a-zA-Z]/.test(value) || '비밀번호에 영어가 포함되어야 합니다.',
                      hasNumber: (value) =>
                        /[0-9]/.test(value) || '비밀번호에 숫자가 포함되어야 합니다.',
                      hasSpecial: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                        '비밀번호에 특수문자가 포함되어야 합니다.',
                    },
                  })}
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
              {errors.password && <span className='error-message'>{errors.password.message}</span>}
            </div>

            <div className='form-group'>
              <div className='password-input-wrapper'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className='form-input password-input'
                  placeholder='비밀번호 확인'
                  {...register('confirmPassword', {
                    required: '비밀번호 확인을 입력해주세요.',
                    validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
                  })}
                />
                <button
                  type='button'
                  className='password-toggle'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={showConfirmPassword ? '/assets/hide.png' : '/assets/view.png'}
                    alt={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className='error-message'>{errors.confirmPassword.message}</span>
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
