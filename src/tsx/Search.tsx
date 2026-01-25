import { useState, useEffect } from 'react';
import '../css/search.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCourseSearchQuery } from '../hooks/useCourseQuery';
import { useAddToCartMutation, useCartQuery } from '../hooks/useCartQuery';
import type { CourseDetailResponse } from '../types/apiTypes';
import { isAxiosError } from 'axios';
import Warning from '../utils/Warning';
import {
  hasTimeConflict,
  extractTimeFromPlaceAndTime,
} from '../utils/timeUtils';

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

const PAGE_SIZE = 10;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const keyword = searchParams.get('query') || '';
  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const [captchaDigits] = useState<CaptchaDigit[]>(() => makeCaptchaDigits());
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(
    new Set()
  );
  const [showCartModal, setShowCartModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showNotSupporting, setShowNotSupporting] = useState(false);
  const [showNoCourseSelected, setShowNoCourseSelected] = useState(false);
  const [showTimeOverlapModal, setShowTimeOverlapModal] = useState(false);
  const [conflictCourse, setConflictCourse] = useState<{
    name: string;
    code: string;
  } | null>(null);

  const { data: cartData } = useCartQuery();
  const { data, isLoading, error } = useCourseSearchQuery({
    query: keyword,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const addToCartMutation = useAddToCartMutation();

  const courses = data?.items ?? [];
  const totalCount = data?.pageInfo.totalElements ?? 0;
  const totalPages = data?.pageInfo.totalPages ?? 0;

  const isModalOpen =
    showCartModal ||
    showConflictModal ||
    showNotSupporting ||
    showTimeOverlapModal;

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const setPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses((prev) => {
      if (prev.has(courseId)) {
        return new Set();
      } else {
        return new Set([courseId]);
      }
    });
  };

  const handleAddToCart = async () => {
    if (selectedCourses.size === 0) {
      setShowNoCourseSelected(true);
      return;
    }

    const courseId = Array.from(selectedCourses)[0];
    const selectedCourse = courses.find((c: CourseDetailResponse) => c.id === courseId);

    if (selectedCourse && cartData) {
      const selectedTimeStr = extractTimeFromPlaceAndTime(
        selectedCourse.placeAndTime
      );

      for (const cartItem of cartData) {
        const cartTimeStr = extractTimeFromPlaceAndTime(
          cartItem.course.placeAndTime
        );
        if (hasTimeConflict(selectedTimeStr, cartTimeStr)) {
          setShowTimeOverlapModal(true);
          return;
        }
      }
    }

    try {
      const promises = Array.from(selectedCourses).map((courseId) =>
        addToCartMutation.mutateAsync({ courseId })
      );
      await Promise.all(promises);
      setSelectedCourses(new Set());
      setShowCartModal(true);
    } catch (err) {
      console.error('[Search] 장바구니 추가 실패:', err);
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          const courseId = Array.from(selectedCourses)[0];
          const course = courses.find((c: CourseDetailResponse) => c.id === courseId);

          if (course) {
            setConflictCourse({
              name: course.courseTitle || '알 수 없는 강의',
              code: course.courseNumber || '',
            });
            setShowConflictModal(true);
          }
          setSelectedCourses(new Set());
        } else {
          alert(
            `장바구니 추가 실패: ${err.response.data.message || '알 수 없는 오류'}`
          );
        }
      } else {
        alert('장바구니 추가 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="searchPage">
      <Warning
        variant="double"
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onConfirm={() => {
          setShowCartModal(false);
          navigate('/cart');
        }}
        title="장바구니에 담겼습니다."
        subtitle="지금 바로 장바구니로 이동하시겠습니까?"
        cancelLabel="아니요, 괜찮습니다."
        confirmLabel="장바구니로 이동"
      />

      {conflictCourse && (
        <Warning
          variant="double"
          isOpen={showConflictModal}
          onClose={() => {
            setShowConflictModal(false);
            setConflictCourse(null);
          }}
          onConfirm={() => {
            setShowConflictModal(false);
            setConflictCourse(null);
            navigate('/cart');
          }}
          cancelLabel="아니요, 괜찮습니다."
          confirmLabel="장바구니로 이동"
        >
          <h2 className="modal-title-conflict">
            {conflictCourse.name} ({conflictCourse.code}) :<br />
            수업교시가 중복되었습니다.
          </h2>
          <p className="modal-subtitle">
            지금 바로 장바구니로
            <br />
            이동하시겠습니까?
          </p>
        </Warning>
      )}

      <Warning
        variant="single"
        icon="warning"
        isOpen={showNotSupporting}
        onClose={() => setShowNotSupporting(false)}
      >
        <p className="warningText">지원하지 않는 기능입니다.</p>
      </Warning>

      <Warning
        variant="single"
        icon="warning"
        isOpen={showNoCourseSelected}
        onClose={() => setShowNoCourseSelected(false)}
      >
        <p className="warningText">장바구니 담기할 강좌를 선택해주십시오.</p>
      </Warning>

      <Warning
        variant="single"
        icon="warning"
        isOpen={showTimeOverlapModal}
        onClose={() => setShowTimeOverlapModal(false)}
      >
        <p className="warningText">
          중복된 시간대의 강의를
          <br />
          장바구니에 담을 수 없습니다.
        </p>
      </Warning>

      <div className="containerX">
        <div className="searchHeader">
          <h2 className="searchTitle">
            <span className="quote">'{keyword}'</span> 검색 결과
          </h2>
          <p className="searchCount">
            <span className="countNum">{isLoading ? '...' : totalCount}</span>
            건의 교과목이 검색되었습니다.
          </p>
        </div>

        <div className="searchToolbar">
          <div className="legendList">
            <div className="legendItem">
              <span className="legendIcon">O</span> 원격수업강좌
            </div>
            <div className="legendItem">
              <span className="legendIcon">M</span> 군휴학생 원격수업 강좌
            </div>
            <div className="legendItem">
              <span className="legendIcon">C</span> 크로스리스팅
            </div>
            <div className="legendItem">
              <span className="legendIcon">R</span> 수강반 제한
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </span>{' '}
              외국어강의
            </div>
            <div className="legendItem">
              <span className="legendIcon">K</span> 거점국립대학 원격수업 강좌
            </div>
            <button className="excelBtn">엑셀저장</button>
          </div>
        </div>

        <div className="searchContent">
          <div className="searchLeftColumn">
            <hr className="blackLine" />
            <div className="resultListArea">
              {isLoading && <p className="stateMessage">검색 중...</p>}
              {error && (
                <p className="stateMessage error">강의 검색에 실패했습니다.</p>
              )}
              {!isLoading && !error && courses.length === 0 && keyword && (
                <p className="stateMessage">검색 결과가 없습니다.</p>
              )}
              {!isLoading &&
                courses.map((course: CourseDetailResponse) => {
                  const isSelected = selectedCourses.has(course.id);
                  const cartCount = 0;

                  return (
                    <div
                      key={course.id}
                      className="courseItem"
                      onClick={() => toggleCourseSelection(course.id)}
                    >
                      <div className="courseCheckArea">
                        <button
                          className={`customCheckBtn ${isSelected ? 'checked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCourseSelection(course.id);
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

                      <div className="courseInfoArea">
                        <div className="infoRow">
                          <span className="c-type">
                            [
                            {course.academicCourse === '학사'
                              ? '학사'
                              : '대학원'}
                            ] [{course.classification}]
                          </span>
                          <span className="c-title">{course.courseTitle}</span>
                        </div>
                        <div className="infoRow">
                          <span className="c-prof">{course.instructor}</span>
                          <span className="c-divider">|</span>
                          <span className="c-dept">{course.department}</span>
                          <span className="c-divider">|</span>
                          <span className="c-coursenum">
                            {course.courseNumber}({course.lectureNumber})
                          </span>
                        </div>
                        <div className="infoRow">
                          <span className="c-label">
                            수강신청인원/정원(재학생)
                          </span>
                          <span className="c-val-blue">
                            0/{course.quota} ({course.quota})
                          </span>
                          <span className="c-divider-light">|</span>
                          <span className="c-label">총수강인원</span>
                          <span className="c-val-blue">0</span>
                          <span className="c-divider-light">|</span>
                          <span className="c-label">학점</span>
                          <span className="c-val-blue">{course.credit}</span>
                          <span className="c-divider-light">|</span>
                          <span className="c-schedule">
                            {course.placeAndTime
                              ? JSON.parse(course.placeAndTime).time?.replace(
                                  /\//g,
                                  ' '
                                ) || '시간 미정'
                              : ''}
                          </span>
                        </div>
                      </div>

                      <div className="courseActionArea">
                        <div className="cartInfoBox">
                          <svg
                            className="cartIconSvg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          <span
                            className={`cartCountNum ${cartCount > 0 ? 'red' : ''}`}
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
            <div>
              <p
                style={{
                  fontSize: '14px',
                  marginLeft: '10px',
                }}
              >
                <span className="countNum">{totalCount}</span>건
              </p>
            </div>

            {!isLoading && !error && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pageBtn"
                  onClick={() => setPage(0)}
                  disabled={currentPage === 0}
                >
                  <img src="/assets/btn-arrow-first.png" alt="처음" />
                </button>
                <button
                  className="pageBtn"
                  onClick={() => setPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <img src="/assets/btn_page_back.png" alt="이전" />
                </button>

                {Array.from(
                  {
                    length: Math.min(5, totalPages),
                  },
                  (_, i) => {
                    const startPage = Math.floor(currentPage / 5) * 5;
                    const pageNum = startPage + i;
                    if (pageNum >= totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        className={`pageNumber ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  }
                )}

                <button
                  className="pageBtn"
                  onClick={() =>
                    setPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                >
                  <img src="/assets/btn_page_next.png" alt="다음" />
                </button>
                <button
                  className="pageBtn"
                  onClick={() => setPage(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  <img src="/assets/btn-arrow-last.png" alt="마지막" />
                </button>
              </div>
            )}
          </div>

          <div className="searchRightColumn">
            <div className="searchFloatingMenu">
              <button
                className="floatBtn outlineBtn"
                onClick={() => setShowNotSupporting(true)}
              >
                관심강좌 저장
              </button>
              <button
                className="floatBtn fillBlueBtn"
                onClick={handleAddToCart}
              >
                장바구니 담기
              </button>

              <div className="floatLine"></div>

              <div className="captchaRow">
                <div className="captchaBox">
                  {captchaDigits.map((digit, index) => (
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
                  ))}
                </div>
                <input className="captchaInput" placeholder="입 력" />
              </div>

              <button
                className="floatBtn fillRedBtn"
                onClick={() => setShowNotSupporting(true)}
              >
                수강신청
              </button>
              <button
                className="floatBtn outlineWhiteBtn"
                onClick={() => setShowNotSupporting(true)}
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
