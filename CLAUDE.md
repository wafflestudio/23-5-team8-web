# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Course registration simulation platform (유사 수강신청 시뮬레이션) that mimics a SNU course registration system. Built with React 19, TypeScript, and Vite. Features user authentication, course search, shopping cart, and competitive registration mechanics.

## Development Commands

```bash
npm run dev        # Start Vite dev server (proxies /api to https://allclear.codes/)
npm run build      # Production build
npm run lint       # ESLint check
npm run typecheck  # TypeScript type checking
npm run test       # Runs lint + typecheck
npm run preview    # Preview production build
```

**Git Hooks (Husky):**

- Pre-commit: `npm run lint`
- Pre-push: `npm test && npm run lint && npm run build`

## Architecture

### Directory Structure

```
src/
├── tsx/          # React page components (App.tsx is the router/layout)
├── api/          # API integration (axios instance + endpoint modules)
├── contexts/     # AuthContext with 10-minute session timeout
├── hooks/        # Custom hooks (usePracticeWindow)
├── types/        # TypeScript DTOs (apiTypes.tsx)
├── utils/        # Modal components and utility functions
└── css/          # Page-specific stylesheets
```

### Key Patterns

**API Layer:**

- Centralized axios instance at `src/api/axios.ts` with Bearer token interceptor
- Separate API modules per feature: `auth.ts`, `courses.ts`, `cart.ts`, `registration.ts`
- Base URL from `VITE_API_URL` env var, defaults to `https://allclear.codes/`

**Authentication:**

- AuthProvider wraps app with session management
- 10-minute auto-logout timer, resets on navigation
- Tokens stored in sessionStorage
- Uses `useAuth()` hook to access auth context

**Error Handling:**

- Use `isAxiosError()` type guard for API error checking
- Modal utilities in `src/utils/` for user-facing alerts

### Main Pages

- `HomePage.tsx` - Schedule and course info
- `Login.tsx` / `Register.tsx` - Auth with Kakao/Google social login
- `Search.tsx` - Course search with CAPTCHA verification
- `Cart.tsx` - Pre-enrollment cart management
- `RegistrationPage.tsx` - Registration simulator with queue system
- `EnrollmentHistory.tsx` - Past registrations

## Coding Conventions

### Naming

| Element | Convention | Example |
|---------|------------|---------|
| Component files | PascalCase | `HomePage.tsx`, `CartConfirmModal.tsx` |
| CSS files | camelCase | `homePage.css`, `needLogin.css` |
| Variables/functions | camelCase | `handleLogin`, `setUser`, `fetchCartCourses` |
| Types/Interfaces | PascalCase + suffix | `LoginResponse`, `CourseSearchRequest`, `AuthContextType` |
| CSS classes | kebab-case | `.login-page`, `.cart-notice-box`, `.form-group` |

### TypeScript

- Use `interface` for object shapes, `type` for unions
- All API responses must be typed with generics: `api.post<ResponseType>('/endpoint', data)`
- Use `import type` for type-only imports: `import type { Course } from '../types/apiTypes.tsx'`
- Define shared types in `src/types/apiTypes.tsx`
- Component-specific types can be defined at the top of the component file

### React Components

- Use functional components exclusively (no class components)
- One default-exported component per file
- State management: Context API for global state, useState for local state
- Use `useCallback` for functions passed as props or used in dependency arrays

### API Calls

- Create wrapper functions in `src/api/` directory
- Use `isAxiosError()` type guard for error handling
- Handle errors with status-based switch statements:

```typescript
try {
  const response = await someApi(data);
  // handle success
} catch (error) {
  if (isAxiosError(error) && error.response) {
    switch (error.response.status) {
      case 400:
        // handle bad request
        break;
      case 401:
        // handle unauthorized
        break;
    }
  }
}
```

### Imports

Organize imports in this order:
1. React and library imports
2. Component imports
3. Relative imports (api, utils, types, contexts)
4. CSS imports

### Styles

- One CSS file per page/feature
- Modal components share `needLogin.css` for common modal styles
- Global CSS variables defined in `header.css` (`:root` block)
- Avoid inline styles; move all styles to CSS files

## Environment Variables

Required for full functionality:

- `VITE_API_URL` - Backend API URL
- `VITE_KAKAO_REST_API_KEY` - Kakao OAuth
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth

## Tech Stack

- React 19.2 with React Compiler (babel-plugin-react-compiler)
- TypeScript 5.9 (strict mode)
- Vite 7.2
- React Router DOM 7.11
- Axios for HTTP
- Playwright for E2E tests (config present, tests in `./tests/`)
