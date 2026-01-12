import { useState } from "react";
import "../css/enrollmentHistory.css";

export default function EnrollmentHistory() {
  const [activeTab, setActiveTab] =
    useState("선택삭제");

  return (
    <main className="page">
      <div className="containerX">
        <h1 className="enrollment-page-title">
          수강신청내역
        </h1>

        <div className="enrollment-left-section">
          <p className="enrollment-notice-text">
            ※ 신입생은 신입생세미나 등 일부 교과를
            신청할 때 주의할 것
          </p>

          <div className="enrollment-tabs-container">
            <button
              className={`enrollment-tab-button ${
                activeTab === "선택삭제"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("선택삭제")
              }
            >
              선택삭제
            </button>
            <button
              className={`enrollment-tab-button ${
                activeTab === "엑셀저장"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab("엑셀저장")
              }
            >
              엑셀저장
            </button>
            <span className="enrollment-credit-info">
              신청가능학점{" "}
              <span className="enrollment-credit-number">
                21
              </span>
              학점 / 신청학점{" "}
              <span className="enrollment-credit-number">
                0
              </span>
              학점 / 신청과목{" "}
              <span className="enrollment-credit-number">
                0
              </span>
              과목
            </span>
          </div>

          <div className="enrollment-content-box">
            <div className="enrollment-empty-state">
              <p className="enrollment-empty-text">
                수강신청 내역이 없습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
