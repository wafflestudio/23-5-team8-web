import { useState, useEffect } from "react";
import "../css/search.css";
import { useLocation } from "react-router-dom";
import showNotSupportedToast from "../utils/notSupporting";
import { searchCoursesApi } from "../api/courses";
import type { Course } from "../types/apiTypes.tsx";

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

  const colors = [
    "#1f4e38",
    "#5a3e1b",
    "#2b2b80",
    "#631818",
    "#2f4f4f",
  ];

  return chars.map((char) => ({
    value: char.toString(),
    rotation: Math.random() * 40 - 20,
    yOffset: Math.random() * 8 - 4,
    xOffset: Math.random() * 10 - 5,
    color:
      colors[
        Math.floor(Math.random() * colors.length)
      ],
    fontSize: Math.floor(Math.random() * 7) + 20,
  }));
}

export default function SearchPage() {
  const [captchaDigits] = useState<
    CaptchaDigit[]
  >(() => makeCaptchaDigits());
  const [courses, setCourses] = useState<
    Course[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    string | null
  >(null);
  const [selectedCourses, setSelectedCourses] =
    useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] =
    useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allCourses, setAllCourses] = useState<
    Course[]
  >([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(
    location.search
  );
  const keyword = searchParams.get("query") || "";
  const pageSize = 10;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!keyword) return;

      setLoading(true);
      setCurrentPage(0);
      try {
        const response = await searchCoursesApi({
          keyword,
          page: 0,
          size: 10000, // 모든 검색 결과를 가져오기
        });

        // 클라이언트에서 필터링: 강의명, 교수명, 학과명에서 검색
        const filteredCourses =
          response.data.items.filter((course) => {
            const searchLower =
              keyword.toLowerCase();
            return (
              course.courseTitle
                ?.toLowerCase()
                .includes(searchLower) ||
              course.instructor
                ?.toLowerCase()
                .includes(searchLower) ||
              course.department
                ?.toLowerCase()
                .includes(searchLower) ||
              course.college
                ?.toLowerCase()
                .includes(searchLower)
            );
          });

        setAllCourses(filteredCourses);
        setTotalCount(filteredCourses.length);
        setTotalPages(
          Math.ceil(
            filteredCourses.length / pageSize
          )
        );
      } catch (err) {
        console.error("강의 검색 실패:", err);
        setError("강의 검색에 실패했습니다.");
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [keyword, pageSize]);

  // 현재 페이지의 강의 목록 계산
  useEffect(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    setCourses(
      allCourses.slice(startIndex, endIndex)
    );
  }, [currentPage, allCourses, pageSize]);

  const toggleCourseSelection = (
    courseId: number
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

  return (
    <div className="searchPage">
      <div className="containerX">
        <div className="searchHeader">
          <h2 className="searchTitle">
            <span className="quote">
              '{keyword}'
            </span>{" "}
            검색 결과
          </h2>
          <p className="searchCount">
            <span className="countNum">
              {loading ? "..." : totalCount}
            </span>
            건의 교과목이 검색되었습니다.
          </p>
        </div>

        <div className="searchToolbar">
          <div className="legendList">
            <div className="legendItem">
              <span className="legendIcon">
                O
              </span>{" "}
              원격수업강좌
            </div>
            <div className="legendItem">
              <span className="legendIcon">
                M
              </span>{" "}
              군휴학생 원격수업 강좌
            </div>
            <div className="legendItem">
              <span className="legendIcon">
                C
              </span>{" "}
              크로스리스팅
            </div>
            <div className="legendItem">
              <span className="legendIcon">
                R
              </span>{" "}
              수강반 제한
            </div>
            <div className="legendItem">
              <span className="legendIcon globe">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  ></circle>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </span>{" "}
              외국어강의
            </div>
            <div className="legendItem">
              <span className="legendIcon">
                K
              </span>{" "}
              거점국립대학 원격수업 강좌
            </div>
            <button className="excelBtn">
              엑셀저장
            </button>
          </div>
        </div>

        <div className="searchContent">
          <div className="searchLeftColumn">
            <hr className="blackLine" />
            <div className="resultListArea">
              {loading && (
                <p className="stateMessage">
                  검색 중...
                </p>
              )}
              {error && (
                <p className="stateMessage error">
                  {error}
                </p>
              )}
              {!loading &&
                !error &&
                courses.length === 0 &&
                keyword && (
                  <p className="stateMessage">
                    검색 결과가 없습니다.
                  </p>
                )}
              {!loading &&
                courses.map((course) => {
                  const isSelected =
                    selectedCourses.has(
                      course.id
                    );
                  const cartCount = 0; // 장바구니 개수 (나중에 구현)

                  return (
                    <div
                      key={course.id}
                      className="courseItem"
                      onClick={() =>
                        toggleCourseSelection(
                          course.id
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
                              course.id
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
                            {course.academicCourse ===
                            "학사"
                              ? "학사"
                              : "대학원"}
                            ] [
                            {
                              course.classification
                            }
                            ]
                          </span>
                          <span className="c-title">
                            {course.courseTitle}
                          </span>
                        </div>
                        <div className="infoRow">
                          <span className="c-prof">
                            {course.instructor}
                          </span>
                          <span className="c-divider">
                            |
                          </span>
                          <span className="c-dept">
                            {course.department}
                          </span>
                          <span className="c-divider">
                            |
                          </span>
                          <span className="c-coursenum">
                            {course.courseNumber}
                          </span>
                        </div>
                        <div className="infoRow">
                          <span className="c-label">
                            수강신청인원/정원(재학생)
                          </span>
                          <span className="c-val-blue">
                            0/{course.quota} (
                            {course.quota})
                          </span>
                          <span className="c-divider-light">
                            |
                          </span>
                          <span className="c-label">
                            총수강인원
                          </span>
                          <span className="c-val-blue">
                            0
                          </span>
                          <span className="c-divider-light">
                            |
                          </span>
                          <span className="c-label">
                            학점
                          </span>
                          <span className="c-val-blue">
                            {course.credit}
                          </span>
                          <span className="c-divider-light">
                            |
                          </span>
                          <span className="c-schedule">
                            {course.placeAndTime
                              ? JSON.parse(
                                  course.placeAndTime
                                ).time ||
                                "시간 미정"
                              : "시간 미정"}
                          </span>
                        </div>
                      </div>

                      {/* 3. 장바구니 & 화살표 */}
                      <div className="courseActionArea">
                        <div className="cartInfoBox">
                          <svg
                            className="cartIconSvg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle
                              cx="9"
                              cy="21"
                              r="1"
                            />
                            <circle
                              cx="20"
                              cy="21"
                              r="1"
                            />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          <span
                            className={`cartCountNum ${
                              cartCount > 0
                                ? "red"
                                : ""
                            }`}
                          >
                            {cartCount}
                          </span>
                        </div>
                        <div className="arrowBox">
                          <svg
                            width="10"
                            height="16"
                            viewBox="0 0 10 16"
                            fill="none"
                          >
                            <path
                              d="M1 1L8 8L1 15"
                              stroke="#aaa"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 페이지네이션 */}
            {!loading &&
              !error &&
              totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pageBtn"
                    onClick={() =>
                      setCurrentPage(0)
                    }
                    disabled={currentPage === 0}
                  >
                    <img
                      src="/assets/btn-arrow-first.png"
                      alt="처음"
                    />
                  </button>
                  <button
                    className="pageBtn"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.max(0, prev - 1)
                      )
                    }
                    disabled={currentPage === 0}
                  >
                    <img
                      src="/assets/btn_page_back.png"
                      alt="이전"
                    />
                  </button>

                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        totalPages
                      ),
                    },
                    (_, i) => {
                      const startPage =
                        Math.floor(
                          currentPage / 5
                        ) * 5;
                      const pageNum =
                        startPage + i;
                      if (pageNum >= totalPages)
                        return null;

                      return (
                        <button
                          key={pageNum}
                          className={`pageNumber ${
                            currentPage ===
                            pageNum
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentPage(
                              pageNum
                            )
                          }
                        >
                          {pageNum + 1}
                        </button>
                      );
                    }
                  )}

                  <button
                    className="pageBtn"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          totalPages - 1,
                          prev + 1
                        )
                      )
                    }
                    disabled={
                      currentPage >=
                      totalPages - 1
                    }
                  >
                    <img
                      src="/assets/btn_page_next.png"
                      alt="다음"
                    />
                  </button>
                  <button
                    className="pageBtn"
                    onClick={() =>
                      setCurrentPage(
                        totalPages - 1
                      )
                    }
                    disabled={
                      currentPage >=
                      totalPages - 1
                    }
                  >
                    <img
                      src="/assets/btn-arrow-last.png"
                      alt="마지막"
                    />
                  </button>
                </div>
              )}
          </div>

          <div className="searchRightColumn">
            <div className="searchFloatingMenu">
              <button
                className="floatBtn outlineBtn"
                onClick={showNotSupportedToast}
              >
                관심강좌 저장
              </button>
              <button className="floatBtn fillBlueBtn">
                장바구니 담기
              </button>

              <div className="floatLine"></div>

              <div className="captchaRow">
                <div className="captchaBox">
                  {captchaDigits.map(
                    (digit, index) => (
                      <span
                        key={index}
                        className="captchaDigit"
                        style={{
                          transform: `rotate(${digit.rotation}deg) translateY(${digit.yOffset}px) translateX(${digit.xOffset}px)`,
                          color: digit.color,
                          fontSize: `${digit.fontSize}px`,
                        }}
                      >
                        {digit.value}
                      </span>
                    )
                  )}
                </div>
                <input
                  className="captchaInput"
                  placeholder="입 력"
                />
              </div>

              <button className="floatBtn fillRedBtn">
                수강신청
              </button>
              <button
                className="floatBtn outlineWhiteBtn"
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
