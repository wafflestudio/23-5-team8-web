import { useState, useEffect } from "react";
import "../css/enrollmentHistory.css";
import { getPracticeResultApi } from "../api/registration";
import { searchCoursesApi } from "../api/courses";
import type {
  PracticeAttemptDetail,
  Course,
} from "../types/apiTypes.tsx";
import { isAxiosError } from "axios";
import DeleteSuccessModal from "../utils/deleteSuccessModal";

interface EnrolledCourse extends PracticeAttemptDetail {
  course: Course;
}

export default function EnrollmentHistory() {
  const [activeTab, setActiveTab] =
    useState("선택삭제");
  const [enrolledCourses, setEnrolledCourses] =
    useState<EnrolledCourse[]>([]);
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
      // localStorage에서 현재 연습 세션 ID 가져오기
      const practiceLogId = localStorage.getItem(
        "currentPracticeLogId",
      );

      if (!practiceLogId) {
        console.log("활성 연습 세션이 없습니다.");
        setEnrolledCourses([]);
        setLoading(false);
        return;
      }

      // 해당 로그의 결과 조회
      const resultResponse =
        await getPracticeResultApi(
          Number(practiceLogId),
        );

      console.log(
        "결과 응답:",
        resultResponse.data,
      );

      const attempts =
        resultResponse.data.attempts;

      // 성공한 강의만 필터링
      const successfulAttempts = attempts.filter(
        (attempt: PracticeAttemptDetail) =>
          attempt.isSuccess,
      );

      console.log(
        "성공한 시도들:",
        successfulAttempts,
      );

      // 각 성공한 시도에 대해 강의 정보 검색으로 가져오기
      const coursesWithDetails =
        await Promise.all(
          successfulAttempts.map(
            async (attempt: PracticeAttemptDetail) => {
              try {
                // 강의명으로 검색
                const searchResponse =
                  await searchCoursesApi({
                    query: attempt.courseTitle,
                    page: 0,
                    size: 100,
                  });

                // 검색 결과에서 courseId와 lectureNumber가 모두 일치하는 강의 찾기
                const matchedCourse =
                  searchResponse.data.items.find(
                    (course) =>
                      course.id ===
                        attempt.courseId &&
                      course.lectureNumber ===
                        attempt.lectureNumber,
                  );

                if (matchedCourse) {
                  return {
                    ...attempt,
                    course: matchedCourse,
                  } as EnrolledCourse;
                } else {
                  // courseId만으로라도 찾아보기
                  const courseByIdMatch =
                    searchResponse.data.items.find(
                      (course) =>
                        course.id ===
                        attempt.courseId,
                    );

                  if (courseByIdMatch) {
                    return {
                      ...attempt,
                      course: courseByIdMatch,
                    } as EnrolledCourse;
                  }

                  console.warn(
                    `강의를 찾을 수 없습니다: ${attempt.courseTitle} (ID: ${attempt.courseId}, 분반: ${attempt.lectureNumber})`,
                  );
                  return null;
                }
              } catch (error) {
                console.error(
                  `강의 정보 조회 실패 (courseId: ${attempt.courseId}):`,
                  error,
                );
                return null;
              }
            },
          ),
        );

      // null이 아닌 항목만 필터링
      const validCourses =
        coursesWithDetails.filter(
          (course): course is EnrolledCourse =>
            course !== null,
        );

      setEnrolledCourses(validCourses);
    } catch (error) {
      console.error(
        "수강신청 내역 조회 실패:",
        error,
      );
      if (isAxiosError(error)) {
        console.error("에러 상세:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 404) {
          // 연습 로그가 없는 경우
          setEnrolledCourses([]);
        } else {
          // 다른 에러는 조용히 처리 (빈 상태로)
          setEnrolledCourses([]);
        }
      } else {
        setEnrolledCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 체크박스 토글
  const toggleCourseSelection = (
    courseId: number,
  ) => {
    setSelectedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
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

    // 연습 모드에서는 프론트엔드에서만 삭제 처리
    const remainingCourses =
      enrolledCourses.filter(
        (course) =>
          !selectedCourses.has(course.courseId),
      );

    setEnrolledCourses(remainingCourses);
    setSelectedCourses(new Set());
    setShowDeleteModal(true);
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
                    selectedCourses.has(
                      item.courseId,
                    );

                  return (
                    <div
                      key={item.courseId}
                      className="courseItem"
                      onClick={() =>
                        toggleCourseSelection(
                          item.courseId,
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
                              item.courseId,
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
                            {item.rank}/
                            {item.course.quota} (
                            {item.course.quota})
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
          isOpen={showDeleteModal}
          onClose={() =>
            setShowDeleteModal(false)
          }
        />
      )}
    </main>
  );
}
