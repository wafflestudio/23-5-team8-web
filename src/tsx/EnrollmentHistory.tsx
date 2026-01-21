import { useState, useEffect } from "react";
import "../css/enrollmentHistory.css";
import {
  getLatestPracticeLogApi,
  getPracticeResultApi,
  deletePracticeDetailApi,
} from "../api/registration";
import type { PracticeDetailResponse } from "../types/apiTypes.tsx";
import { isAxiosError } from "axios";
import DeleteSuccessModal from "../utils/deleteSuccessModal";

export default function EnrollmentHistory() {
  const [activeTab, setActiveTab] =
    useState("선택삭제");
  const [enrolledCourses, setEnrolledCourses] =
    useState<PracticeDetailResponse[]>([]);
  const [selectedCourses, setSelectedCourses] =
    useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  // 수강신청 성공 내역 조회
  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    try {
      // 1. 가장 최근 연습 로그 가져오기
      const latestLogResponse =
        await getLatestPracticeLogApi();
      const practiceLogId =
        latestLogResponse.data.id;

      // 2. 해당 로그의 결과 조회
      const resultResponse =
        await getPracticeResultApi(practiceLogId);
      const details = resultResponse.data.details;

      // 3. 성공한 강의만 필터링
      const successfulEnrollments =
        details.filter(
          (detail: PracticeDetailResponse) =>
            detail.isSuccess,
        );

      setEnrolledCourses(successfulEnrollments);
    } catch (error) {
      console.error(
        "수강신청 내역 조회 실패:",
        error,
      );
      if (
        isAxiosError(error) &&
        error.response?.status === 404
      ) {
        // 연습 로그가 없는 경우
        setEnrolledCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 체크박스 토글
  const toggleCourseSelection = (
    detailId: number,
  ) => {
    setSelectedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(detailId)) {
        newSet.delete(detailId);
      } else {
        newSet.add(detailId);
      }
      return newSet;
    });
  };

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (selectedCourses.size === 0) {
      alert("삭제할 강의를 선택해주세요.");
      return;
    }

    try {
      const promises = Array.from(
        selectedCourses,
      ).map((detailId) =>
        deletePracticeDetailApi(detailId),
      );
      await Promise.all(promises);
      setShowDeleteModal(true);
      setSelectedCourses(new Set());
      fetchEnrolledCourses();
    } catch (error) {
      console.error(
        "수강신청 내역 삭제 실패:",
        error,
      );
      if (isAxiosError(error) && error.response) {
        alert(
          `삭제 실패: ${
            error.response.data.message ||
            "알 수 없는 오류"
          }`,
        );
      } else {
        alert(
          "삭제 중 네트워크 오류가 발생했습니다.",
        );
      }
    }
  };

  const totalCredit = enrolledCourses.reduce(
    (sum, item) => sum + item.course.credit,
    0,
  );

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
              onClick={handleDeleteSelected}
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
                {totalCredit}
              </span>
              학점 / 신청과목{" "}
              <span className="enrollment-credit-number">
                {enrolledCourses.length}
              </span>
              과목
            </span>
          </div>

          <div className="enrollment-content-box">
            {loading ? (
              <div className="enrollment-empty-state">
                <p className="enrollment-empty-text">
                  로딩 중...
                </p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="enrollment-empty-state">
                <p className="enrollment-empty-text">
                  수강신청 내역이 없습니다.
                </p>
              </div>
            ) : (
              <div className="resultListArea">
                {enrolledCourses.map((item) => {
                  const isSelected =
                    selectedCourses.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className="courseItem"
                      onClick={() =>
                        toggleCourseSelection(
                          item.id,
                        )
                      }
                    >
                      {/* 1. 체크박스 */}
                      <div className="courseCheckArea">
                        <button
                          className={`customCheckBtn ${
                            isSelected
                              ? "checked"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCourseSelection(
                              item.id,
                            );
                          }}
                        >
                          <svg
                            className="checkIcon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                      </div>

                      {/* 2. 강의 정보 */}
                      <div className="courseInfoArea">
                        <div className="infoRow">
                          <span className="c-type">
                            [
                            {item.course
                              .academicCourse ===
                            "학사"
                              ? "학사"
                              : "대학원"}
                            ] [
                            {
                              item.course
                                .classification
                            }
                            ]
                          </span>
                          <span className="c-title">
                            {
                              item.course
                                .courseTitle
                            }
                          </span>
                        </div>
                        <div className="infoRow">
                          <span className="c-prof">
                            {
                              item.course
                                .instructor
                            }
                          </span>
                          <span className="c-divider">
                            |
                          </span>
                          <span className="c-dept">
                            {
                              item.course
                                .department
                            }
                          </span>
                          <span className="c-divider">
                            |
                          </span>
                          <span className="c-coursenum">
                            {
                              item.course
                                .courseNumber
                            }
                            {item.course
                              .lectureNumber &&
                              `(${item.course.lectureNumber})`}
                          </span>
                        </div>
                        <div className="infoRow">
                          <span className="c-label">
                            수강신청인원/정원(재학생)
                          </span>
                          <span className="c-val-blue">
                            {item.rank}/{item.capacity}{" "}
                            ({item.capacity})
                          </span>
                          <span className="c-divider-light">
                            |
                          </span>
                          <span className="c-label">
                            총수강인원
                          </span>
                          <span className="c-val-blue">
                            {item.rank}
                          </span>
                          <span className="c-divider-light">
                            |
                          </span>
                          <span className="c-label">
                            학점
                          </span>
                          <span className="c-val-blue">
                            {item.course.credit}
                          </span>
                          <span className="c-divider-light">
                            |
                          </span>
                          <span className="c-schedule">
                            {item.course
                              .placeAndTime
                              ? JSON.parse(
                                  item.course
                                    .placeAndTime,
                                ).time ||
                                "시간 미정"
                              : "시간 미정"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteSuccessModal
          onClose={() =>
            setShowDeleteModal(false)
          }
        />
      )}
    </main>
  );
}
