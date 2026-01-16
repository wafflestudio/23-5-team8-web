import { useState, useEffect } from "react";
import {
  getPreEnrollsApi,
  deletePreEnrollApi,
  updateCartCountApi,
} from "../api/cart";
import type { PreEnrollCourseResponse } from "../types/apiTypes.tsx";
import { isAxiosError } from "axios";

export default function Cart() {
  const [cartCourses, setCartCourses] = useState<
    PreEnrollCourseResponse[]
  >([]);
  const [selectedCourses, setSelectedCourses] =
    useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [editingValues, setEditingValues] = useState<
    Map<number, number>
  >(new Map());

  // 장바구니 조회
  useEffect(() => {
    fetchCartCourses();
  }, []);

  const fetchCartCourses = async () => {
    setLoading(true);
    try {
      const response = await getPreEnrollsApi();
      console.log(
        "장바구니 API 응답:",
        response.data
      );
      setCartCourses(response.data);
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 체크박스 토글
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

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (selectedCourses.size === 0) {
      alert("삭제할 강의를 선택해주세요.");
      return;
    }

    if (
      !confirm(
        `${selectedCourses.size}개의 강의를 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      const promises = Array.from(
        selectedCourses
      ).map((courseId) =>
        deletePreEnrollApi(courseId)
      );
      await Promise.all(promises);
      alert("선택한 강의가 삭제되었습니다.");
      setSelectedCourses(new Set());
      fetchCartCourses();
    } catch (error) {
      console.error("장바구니 삭제 실패:", error);
      if (isAxiosError(error) && error.response) {
        alert(
          `삭제 실패: ${
            error.response.data.message ||
            "알 수 없는 오류"
          }`
        );
      } else {
        alert(
          "삭제 중 네트워크 오류가 발생했습니다."
        );
      }
    }
  };

  // cartCount 수정
  const handleCartCountChange = async (
    courseId: number,
    newValue: string
  ) => {
    const newCount = parseInt(newValue);
    if (isNaN(newCount) || newCount < 0) {
      return;
    }

    try {
      await updateCartCountApi(courseId, {
        cartCount: newCount,
      });
      fetchCartCourses();
    } catch (error) {
      console.error(
        "cartCount 수정 실패:",
        error
      );
      if (isAxiosError(error) && error.response) {
        alert(
          `수정 실패: ${
            error.response.data.message ||
            "알 수 없는 오류"
          }`
        );
      }
    }
  };

  const totalCredit = cartCourses.reduce(
    (sum, item) => sum + item.course.credit,
    0
  );

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
            <button
              className="cart-tab-button active"
              onClick={handleDeleteSelected}
            >
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
                {totalCredit}
              </span>
              학점
            </span>
          </div>

          <div className="cart-content-box">
            {loading ? (
              <div className="cart-empty-state">
                <p className="cart-empty-title">
                  로딩 중...
                </p>
              </div>
            ) : cartCourses.length === 0 ? (
              <div className="cart-empty-state">
                <p className="cart-empty-title">
                  장바구니가 비었습니다.
                </p>
                <p className="cart-empty-desc">
                  검색 또는 관심강좌에서 수강신청
                  하실 강좌를 장바구니에 담으세요.
                </p>
              </div>
            ) : (
              <div className="resultListArea">
                {cartCourses.map((item) => {
                  const isSelected =
                    selectedCourses.has(
                      item.course.id
                    );

                  return (
                    <div
                      key={item.preEnrollId}
                      className="courseItem"
                      onClick={() =>
                        toggleCourseSelection(
                          item.course.id
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
                              item.course.id
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
                            0/{item.course.quota}{" "}
                            ({item.course.quota})
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
                                    .placeAndTime
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
                          <input
                            type="number"
                            value={
                              editingValues.has(
                                item.course.id
                              )
                                ? editingValues.get(
                                    item.course.id
                                  )
                                : item.cartCount
                            }
                            onChange={(e) => {
                              e.stopPropagation();
                              const newValue =
                                parseInt(
                                  e.target.value
                                ) || 0;
                              setEditingValues(
                                (prev) => {
                                  const newMap =
                                    new Map(prev);
                                  newMap.set(
                                    item.course.id,
                                    newValue
                                  );
                                  return newMap;
                                }
                              );
                            }}
                            onBlur={(e) => {
                              e.stopPropagation();
                              if (
                                editingValues.has(
                                  item.course.id
                                )
                              ) {
                                handleCartCountChange(
                                  item.course.id,
                                  editingValues
                                    .get(
                                      item.course.id
                                    )!
                                    .toString()
                                );
                                setEditingValues(
                                  (prev) => {
                                    const newMap =
                                      new Map(prev);
                                    newMap.delete(
                                      item.course.id
                                    );
                                    return newMap;
                                  }
                                );
                              }
                            }}
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="cartCountInput"
                            min="0"
                            style={{
                              width: "40px",
                              height: "24px",
                              textAlign: "center",
                              fontSize: "14px",
                              border:
                                "1px solid #ddd",
                              borderRadius: "4px",
                              padding: "2px",
                              marginLeft: "4px",
                            }}
                          />
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
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
