import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] =
    useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", {
      username,
      password,
      rememberMe,
    });
  };

  const handleSocialLogin = (
    provider: string
  ) => {
    console.log(`${provider} 로그인`);
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-header-content">
          <div className="login-logo">
            <img
              src="/src/assets/waffle_logo_title.png"
              alt="Waffle Logo"
              onError={(e) => {
                (
                  e.currentTarget as HTMLImageElement
                ).style.display = "none";
              }}
            />
            <span className="login-logo-text">
              서울대학교 수강신청 연습
            </span>
          </div>
        </div>
      </header>

      <main className="login-main">
        <div className="login-container">
          <h1 className="login-title">
            아이디 로그인
          </h1>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="아이디"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <div className="form-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />
                <span>아이디 저장</span>
              </label>
            </div>

            <button
              type="submit"
              className="login-button"
            >
              로그인
            </button>
          </form>

          <div className="social-login">
            <button
              className="social-login-button kakao"
              onClick={() =>
                handleSocialLogin("카카오")
              }
            >
              <img
                src="/src/assets/kakao_logo.png"
                alt="Kakao"
                className="social-icon"
              />
              카카오로 로그인하기
            </button>
            <button
              className="social-login-button google"
              onClick={() =>
                handleSocialLogin("구글")
              }
            >
              <img
                src="/src/assets/google_logo.png"
                alt="Google"
                className="social-icon"
              />
              구글 아이디로 로그인하기
            </button>
          </div>

          <div className="login-footer">
            <Link
              to="/register"
              className="register-link"
            >
              회원가입하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
