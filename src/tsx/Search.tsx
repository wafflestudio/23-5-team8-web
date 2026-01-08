import {useState, useEffect} from 'react';
import '../css/search.css';
import {useLocation} from 'react-router-dom';

interface CaptchaDigit {
  value: string;
  rotation: number;
  yOffset: number;
  xOffset: number;
  color: string;
  fontSize: number;
}

export default function SearchPage() {
  const [captchaDigits, setCaptchaDigits] = useState<CaptchaDigit[]>([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('query') || '';

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const chars = [num1, num2];

    // Reference 이미지에 보이는 어두운 계열 색상들 (초록, 갈색, 네이비, 짙은 빨강)
    const colors = ['#1f4e38', '#5a3e1b', '#2b2b80', '#631818', '#2f4f4f'];

    const newDigits = chars.map((char) => ({
      value: char.toString(),
      // -20도 ~ 20도 회전
      rotation: Math.random() * 40 - 20,
      // 상하 위치 랜덤 (-4px ~ 4px)
      yOffset: Math.random() * 8 - 4,
      // 좌우 간격 약간의 불규칙함
      xOffset: Math.random() * 10 - 5,
      // 랜덤 색상
      color: colors[Math.floor(Math.random() * colors.length)],
      // 폰트 크기 랜덤 (20px ~ 26px)
      fontSize: Math.floor(Math.random() * 7) + 20,
    }));

    setCaptchaDigits(newDigits);
  }, []);

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
          {/* 왼쪽 칼럼: 툴바, 실선, 리스트 */}
          <div className='searchLeftColumn'>
            <hr className='blackLine' />

            <div className='resultListArea'>
              {/* 여기에 검색 결과 리스트가 들어옵니다 */}
            </div>
          </div>

          {/* 오른쪽 칼럼: 플로팅 메뉴 */}
          <div className='searchRightColumn'>
            <div className='searchFloatingMenu'>
              <button className='floatBtn outlineBtn'>관심강좌 저장</button>
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
              <button className='floatBtn outlineWhiteBtn'>예비수강신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
