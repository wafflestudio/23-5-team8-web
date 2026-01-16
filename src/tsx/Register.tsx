import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { signupApi } from "../api/auth";
import { isAxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [globalError, setGlobalError] = useState<
    string | null
  >(null);

  const validateEmail = (
    value: string
  ): string => {
    if (value.length === 0) return "";
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value))
      return "올바른 이메일 형식이 아닙니다.";
    return "";
  };

  const validatePassword = (
    value: string
  ): string => {
    if (value.length === 0) return "";
    if (value.length < 8) {
      return "비밀번호는 8글자 이상이어야 합니다.";
    }
    if (!/[a-zA-Z]/.test(value)) {
      return "비밀번호에 영어가 포함되어야 합니다.";
    }
    if (!/[0-9]/.test(value)) {
      return "비밀번호에 숫자가 포함되어야 합니다.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "비밀번호에 특수문자가 포함되어야 합니다.";
    }
    return "";
  };

  const validateConfirmPassword = (
    value: string
  ): string => {
    if (value.length === 0) return "";
    if (value !== password) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return "";
  };

  // --- 핸들러 ---
  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value),
    }));
    setGlobalError(null); // 입력 시작하면 글로벌 에러 초기화
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
    }));
    if (confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(
          confirmPassword
        ),
      }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword:
        validateConfirmPassword(value),
    }));
  };

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setGlobalError(null);

    // 1. 프론트엔드 유효성 검사
    const emailError = validateEmail(email);
    const passwordError =
      validatePassword(password);
    const confirmPasswordError =
      validateConfirmPassword(confirmPassword);

    if (
      emailError ||
      passwordError ||
      confirmPasswordError ||
      !name.trim()
    ) {
      setErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        name: !name.trim()
          ? "이름을 입력해주세요."
          : "",
      });
      return;
    }

    try {
      // 2. API 호출 (name -> nickname 매핑)
      await signupApi({
        email,
        password,
        nickname: name,
      });

      alert(
        "회원가입 성공! 로그인 페이지로 이동합니다."
      );
      navigate("/login");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // 3. 에러 처리
        switch (status) {
          case 409: // 이메일 중복
            setErrors((prev) => ({
              ...prev,
              email:
                "이미 사용 중인 이메일입니다.",
            }));
            break;

          case 400: // 유효성 검사 실패 (백엔드에서 오는 구체적 에러)
            if (data.validationErrors) {
              setErrors((prev) => ({
                ...prev,
                email:
                  data.validationErrors.email ||
                  prev.email,
                password:
                  data.validationErrors
                    .password || prev.password,
                name:
                  data.validationErrors
                    .nickname || prev.name,
              }));
            } else {
              setGlobalError(
                data.message ||
                  "입력 정보를 확인해주세요."
              );
            }
            break;

          default:
            setGlobalError(
              "회원가입 중 알 수 없는 오류가 발생했습니다."
            );
            console.error(
              "Register Failed:",
              data
            );
        }
      } else {
        setGlobalError(
          "네트워크 오류가 발생했습니다."
        );
        console.error("Unexpected Error:", error);
      }
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-header-content">
          <div className="login-logo">
            <img
              src="/assets/waffle_logo_title.png"
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
            회원가입
          </h1>

          {globalError && (
            <div
              style={{
                color: "red",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {globalError}
            </div>
          )}

          <form
            className="login-form"
            onSubmit={handleRegister}
          >
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="이름"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
              {errors.name && (
                <span className="error-message">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="이메일"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {errors.email && (
                <span className="error-message">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="form-input password-input"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <img
                    src={
                      showPassword
                        ? "/assets/hide.png"
                        : "/assets/view.png"
                    }
                    alt={
                      showPassword
                        ? "비밀번호 숨기기"
                        : "비밀번호 보기"
                    }
                  />
                </button>
              </div>
              {errors.password && (
                <span className="error-message">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="form-input password-input"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={
                    handleConfirmPasswordChange
                  }
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  <img
                    src={
                      showConfirmPassword
                        ? "/assets/hide.png"
                        : "/assets/view.png"
                    }
                    alt={
                      showConfirmPassword
                        ? "비밀번호 숨기기"
                        : "비밀번호 보기"
                    }
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="login-button"
            >
              회원가입
            </button>
          </form>

          <div className="login-footer">
            <Link
              to="/login"
              className="register-link"
            >
              이미 계정이 있으신가요? 로그인하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
