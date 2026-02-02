import { useState } from 'react';

import { makeCaptchaDigits, type CaptchaDigit } from '../lib/captchaUtils';

export interface UseCaptchaReturn {
  captchaDigits: CaptchaDigit[];
  captchaInput: string;
  setCaptchaInput: (value: string) => void;
  validate: () => boolean;
  refresh: () => void;
  reset: () => void;
}

export function useCaptcha(): UseCaptchaReturn {
  const [captchaDigits, setCaptchaDigits] = useState<CaptchaDigit[]>(() =>
    makeCaptchaDigits()
  );
  const [captchaInput, setCaptchaInput] = useState('');

  const validate = (): boolean => {
    const correctCaptcha = captchaDigits.map((d) => d.value).join('');
    return captchaInput === correctCaptcha;
  };

  const refresh = () => {
    setCaptchaDigits(makeCaptchaDigits());
  };

  const reset = () => {
    setCaptchaInput('');
    setCaptchaDigits(makeCaptchaDigits());
  };

  return {
    captchaDigits,
    captchaInput,
    setCaptchaInput,
    validate,
    refresh,
    reset,
  };
}
