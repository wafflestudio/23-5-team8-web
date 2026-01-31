import { useState, useCallback, useEffect } from 'react';

const copyStyles = (targetDoc: Document) => {
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
      background-color: #2b2b2b;
    }
  `;
  targetDoc.head.appendChild(fontStyle);

  Array.from(document.styleSheets).forEach((styleSheet) => {
    try {
      if (styleSheet.href) {
        const newLink = targetDoc.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = styleSheet.href;
        targetDoc.head.appendChild(newLink);
      } else if (styleSheet.cssRules) {
        const cssRules = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('');
        const newStyle = targetDoc.createElement('style');
        newStyle.textContent = cssRules;
        targetDoc.head.appendChild(newStyle);
      }
    } catch (e) {
      // CORS restrictions may prevent accessing external stylesheets
      console.warn('[usePracticeWindow] Style copy failed:', e);
    }
  });
};

export const usePracticeWindow = () => {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const openWindow = useCallback(
    async (width = 380, height = 230) => {
      if (pipWindow && !pipWindow.closed) {
        pipWindow.close();
        setPipWindow(null);
        return null;
      }

      let win: Window | null = null;

      const targetLeft = window.screen.availWidth - width - 20;
      const targetTop = 20;

      try {
        // Document Picture-in-Picture API (Chrome/Edge)
        if ('documentPictureInPicture' in window) {
          // @ts-expect-error Document PiP API lacks TypeScript definitions
          win = await window.documentPictureInPicture.requestWindow({
            width,
            height,
          });

          if (win) {
            win.moveTo(targetLeft, targetTop);
          }
        } else {
          win = window.open(
            '',
            '_blank',
            `width=${width},height=${height},left=${targetLeft},top=${targetTop},toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no`
          );
        }

        if (win) {
          win.document.title = 'utck 디자인 수강신청 연습 타이머';
          win.document.body.classList.add('pip-mode');
          copyStyles(win.document);

          // pagehide handles both PiP close and popup close events
          win.addEventListener('pagehide', () => {
            setPipWindow(null);
          });

          setPipWindow(win);
          return win;
        }
      } catch (err) {
        console.error('[usePracticeWindow] Failed to open window:', err);
        alert('팝업 차단을 해제하거나 브라우저 설정을 확인해주세요.');
      }
      return null;
    },
    [pipWindow]
  );

  const closeWindow = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  useEffect(() => {
    return () => {
      if (pipWindow && !pipWindow.closed) {
        pipWindow.close();
      }
    };
  }, [pipWindow]);

  return { pipWindow, openWindow, closeWindow };
};
