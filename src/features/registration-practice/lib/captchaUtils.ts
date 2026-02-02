export interface CaptchaDigit {
  value: string;
  rotation: number;
  yOffset: number;
  xOffset: number;
  color: string;
  fontSize: number;
}

const CAPTCHA_COLORS = ['#4a235a', '#154360', '#1b2631', '#78281f', '#0e6251'];

export function makeCaptchaDigits(): CaptchaDigit[] {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const chars = [num1, num2];

  return chars.map((char) => ({
    value: char.toString(),
    rotation: Math.random() * 30 - 15,
    yOffset: Math.random() * 6 - 3,
    xOffset: Math.random() * 6 - 3,
    color: CAPTCHA_COLORS[Math.floor(Math.random() * CAPTCHA_COLORS.length)],
    fontSize: Math.floor(Math.random() * 5) + 24,
  }));
}
