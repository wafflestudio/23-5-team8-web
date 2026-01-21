import {useState, useCallback, useEffect} from 'react';

// 스타일 복사 헬퍼 함수
const copyStyles = (targetDoc: Document) => {
  // 1. 폰트 복사 (필요 시 경로 확인)
  const fontStyle = targetDoc.createElement('style');
  fontStyle.textContent = `
    @font-face {
      font-family: 'MyDSEG7';
      src: url('/fonts/DSEG7.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    body.pip-mode {
      margin: 0;
      overflow: hidden;
      background-color: #2b2b2b; /* 배경색 맞춤 */
    }
  `;
  targetDoc.head.appendChild(fontStyle);

  // 2. 현재 페이지의 모든 스타일시트 복사
  Array.from(document.styleSheets).forEach((styleSheet) => {
    try {
      if (styleSheet.href) {
        // link 태그인 경우
        const newLink = targetDoc.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = styleSheet.href;
        targetDoc.head.appendChild(newLink);
      } else if (styleSheet.cssRules) {
        // style 태그인 경우
        const cssRules = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('');
        const newStyle = targetDoc.createElement('style');
        newStyle.textContent = cssRules;
        targetDoc.head.appendChild(newStyle);
      }
    } catch (e) {
      console.warn('스타일 복사 중 오류 (CORS 등):', e);
    }
  });
};

export const usePracticeWindow = () => {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const openWindow = useCallback(
    async (width = 380, height = 230) => {
      // 이미 창이 열려있으면 닫기
      if (pipWindow && !pipWindow.closed) {
        pipWindow.close();
        setPipWindow(null);
        return null;
      }

      let win: Window | null = null;

      try {
        // 1. Chrome / Edge 등 PiP 지원 브라우저
        if ('documentPictureInPicture' in window) {
          // @ts-expect-error: 최신 API라 타입 정의가 없을 수 있음
          win = await window.documentPictureInPicture.requestWindow({
            width,
            height,
          });
        }
        // 2. Safari / Firefox 등 (Window.open 팝업 사용)
        else {
          const left = window.screenX + window.outerWidth / 2 - width / 2;
          const top = window.screenY + window.outerHeight / 2 - height / 2;

          win = window.open(
            '',
            '_blank',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no`,
          );
        }

        if (win) {
          // 공통: 타이틀 및 스타일 설정
          win.document.title = 'utck 디자인 수강신청 연습 타이머';
          win.document.body.classList.add('pip-mode'); // CSS scoping을 위한 클래스

          // 스타일 주입
          copyStyles(win.document);

          // 닫힘 감지 (PiP는 pagehide, 팝업은 unload/pagehide 혼용)
          win.addEventListener('pagehide', () => {
            setPipWindow(null);
          });

          // 팝업의 경우 닫기 버튼 등으로 닫혔을 때 상태 동기화를 위해 폴링 체크가 필요할 수도 있으나,
          // React Portal이 unmount 될 때 처리가 되므로 일단 pagehide로 처리
          setPipWindow(win);
          return win;
        }
      } catch (err) {
        console.error('창 열기 실패:', err);
        alert('팝업 차단을 해제하거나 브라우저 설정을 확인해주세요.');
      }
      return null;
    },
    [pipWindow],
  );

  const closeWindow = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  // 부모 컴포넌트가 언마운트될 때 창 닫기
  useEffect(() => {
    return () => {
      if (pipWindow && !pipWindow.closed) {
        pipWindow.close();
      }
    };
  }, [pipWindow]);

  return {pipWindow, openWindow, closeWindow};
};
