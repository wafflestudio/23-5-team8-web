import { useState } from 'react';
import '../css/enrollmentHistory.css';
import { useEnrolledCoursesQuery } from '../hooks/useEnrolledCoursesQuery';
import Warning from '../utils/Warning';

export default function EnrollmentHistory() {
  const { data: enrolledCourses = [], isLoading } = useEnrolledCoursesQuery();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showNotSupported, setShowNotSupported] = useState(false);

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourseId((prev) => (prev === courseId ? null : courseId));
  };

  const totalCredit = enrolledCourses.reduce(
    (sum, course) => sum + (course?.credit || 0),
    0
  );

  return (
    <main className="page">
      <div className="containerX">
        <h1 className="enrollment-page-title">수강신청내역</h1>

        <div className="enrollment-left-section">
          <p className="enrollment-notice-text">
            ※ 신입생은 신입생세미나 등 일부 교과목 신청가능학점 초과
            수강신청가능
          </p>

          <div className="enrollment-tabs-container">
            <button
              className="enrollment-tab-button active"
              onClick={() => setShowNotSupported(true)}
            >
              선택삭제
            </button>
            <button
              className="enrollment-tab-button"
              onClick={() => setShowNotSupported(true)}
            >
              엑셀저장
            </button>
            <span className="enrollment-credit-info">
              신청가능학점 <span className="enrollment-credit-number">21</span>
              학점 / 신청학점{' '}
              <span className="enrollment-credit-number">{totalCredit}</span>
              학점 / 신청과목{' '}
              <span className="enrollment-credit-number">
                {enrolledCourses.length}
              </span>
              강좌
            </span>
          </div>

          <div className="enrollment-content-box">
            {isLoading ? (
              <div className="enrollment-empty-state">
                <p className="enrollment-empty-text">로딩 중...</p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="enrollment-empty-state">
                <p className="enrollment-empty-text">
                  수강신청 내역이 없습니다.
                </p>
              </div>
            ) : (
              <div className="resultListArea">
                {enrolledCourses.map((course) => {
                  const isSelected = selectedCourseId === course.id;

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
                            {course.courseNumber}
                            {course.lectureNumber &&
                              `(${course.lectureNumber})`}
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
                          <span className="c-label">학점</span>
                          <span className="c-val-blue">{course.credit}</span>
                          <span className="c-divider-light">|</span>
                          <span className="c-schedule">
                            {course.placeAndTime
                              ? JSON.parse(course.placeAndTime).time?.replace(
                                  /\//g,
                                  ' '
                                ) || '시간 미정'
                              : '시간 미정'}
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

      <Warning
        variant="single"
        icon="warning"
        isOpen={showNotSupported}
        onClose={() => setShowNotSupported(false)}
        title="지원하지 않는 기능입니다."
      />
    </main>
  );
}
