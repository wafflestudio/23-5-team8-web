import {useState} from 'react';
import '../css/search.css';
import {useLocation} from 'react-router-dom';
import showNotSupportedToast from '../utils/notSupporting';

interface CaptchaDigit {
  value: string;
  rotation: number;
  yOffset: number;
  xOffset: number;
  color: string;
  fontSize: number;
}

function makeCaptchaDigits(): CaptchaDigit[] {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const chars = [num1, num2];

  const colors = ['#1f4e38', '#5a3e1b', '#2b2b80', '#631818', '#2f4f4f'];

  return chars.map((char) => ({
    value: char.toString(),
    rotation: Math.random() * 40 - 20,
    yOffset: Math.random() * 8 - 4,
    xOffset: Math.random() * 10 - 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    fontSize: Math.floor(Math.random() * 7) + 20,
  }));
}

export default function SearchPage() {
  const [captchaDigits] = useState<CaptchaDigit[]>(() => makeCaptchaDigits());

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('query') || '';

  return (
    <div className='searchPage'>
      <div className='containerX'>
        <div className='searchHeader'>
          <h2 className='searchTitle'>
            <span className='quote'>'{keyword}'</span> 검색 결과
          </h2>
          <p className='searchCount'>
            <span className='countNum'>7981</span>건의 교과목이 검색되었습니다.
          </p>
        </div>

        <div className='searchToolbar'>
          <div className='legendList'>
            <div className='legendItem'>
              <span className='legendIcon'>O</span> 원격수업강좌
            </div>
            <div className='legendItem'>
              <span className='legendIcon'>M</span> 군휴학생 원격수업 강좌
            </div>
            <div className='legendItem'>
              <span className='legendIcon'>C</span> 크로스리스팅
            </div>
            <div className='legendItem'>
              <span className='legendIcon'>R</span> 수강반 제한
            </div>
            <div className='legendItem'>
              <span className='legendIcon globe'>
                <svg
                  viewBox='0 0 24 24'
                  width='14'
                  height='14'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='12' cy='12' r='10'></circle>
                  <path d='M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'></path>
                </svg>
              </span>{' '}
              외국어강의
            </div>
            <div className='legendItem'>
              <span className='legendIcon'>K</span> 거점국립대학 원격수업 강좌
            </div>
            <button className='excelBtn'>엑셀저장</button>
          </div>
        </div>

        <div className='searchContent'>
          <div className='searchLeftColumn'>
            <hr className='blackLine' />
            <div className='resultListArea'></div>
          </div>

          <div className='searchRightColumn'>
            <div className='searchFloatingMenu'>
              <button
                className='floatBtn outlineBtn'
                onClick={showNotSupportedToast}
              >
                관심강좌 저장
              </button>
              <button className='floatBtn fillBlueBtn'>장바구니 담기</button>

              <div className='floatLine'></div>

              <div className='captchaRow'>
                <div className='captchaBox'>
                  {captchaDigits.map((digit, index) => (
                    <span
                      key={index}
                      className='captchaDigit'
                      style={{
                        transform: `rotate(${digit.rotation}deg) translateY(${digit.yOffset}px) translateX(${digit.xOffset}px)`,
                        color: digit.color,
                        fontSize: `${digit.fontSize}px`,
                      }}
                    >
                      {digit.value}
                    </span>
                  ))}
                </div>
                <input className='captchaInput' placeholder='입 력' />
              </div>

              <button className='floatBtn fillRedBtn'>수강신청</button>
              <button
                className='floatBtn outlineWhiteBtn'
                onClick={showNotSupportedToast}
              >
                예비수강신청
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
