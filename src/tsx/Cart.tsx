export default function Cart() {
  return (
    <main className="page">
      <div className="containerX">
        <h1 className="cart-page-title">
          장바구니
        </h1>

        <div className="cart-notice-box">
          <div className="cart-notice-left">
            <p className="cart-notice-date">
              2026년 01월 27일 09:00~23:59
            </p>
            <p className="cart-notice-date">
              2026년 01월 28일 00:00~16:00
            </p>
          </div>
          <div className="cart-notice-right">
            <p className="cart-notice">
              ※ 마감시간 이후에는 변경이 불가하며,
              인원충족 시 전산확정 됩니다.
            </p>
            <p className="cart-notice">
              ※ 장바구니 담기 기간 이후의
              변동내역은 장바구니에 적용되지
              않습니다.
            </p>
          </div>
        </div>

        <div className="cart-left-section">
          <div className="cart-tabs-container">
            <button className="cart-tab-button active">
              선택삭제
            </button>
            <button className="cart-tab-button">
              관심강좌
              <img
                src="/assets/btn_arrow_view_gray.png"
                alt=""
                className="cart-btn-arrow"
              />
            </button>
            <button className="cart-tab-button">
              전공이수내역조회
              <img
                src="/assets/btn_arrow_view_gray.png"
                alt=""
                className="cart-btn-arrow"
              />
            </button>
            <span className="cart-credit-info">
              신청가능학점{" "}
              <span className="cart-credit-number">
                0
              </span>
              학점 / 담은 학점{" "}
              <span className="cart-credit-number">
                0
              </span>
              학점
            </span>
          </div>

          <div className="cart-content-box">
            <div className="cart-empty-state">
              <p className="cart-empty-title">
                장바구니가 비었습니다.
              </p>
              <p className="cart-empty-desc">
                검색 또는 관심강좌에서 수강신청
                하실 강좌를 장바구니에 담으세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
