import { useState } from 'react';
import '../css/enrollmentHistory.css';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axios';
import type { Course } from '../types/apiTypes';
import { useModalStore } from '../stores/modalStore';
import Warning from '../utils/Warning';

export default function EnrollmentHistory() {
  const [activeTab, setActiveTab] = useState('선택삭제');
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(
    new Set()
  );
  const [deletedCourseIds, setDeletedCourseIds] = useState<Set<number>>(
    new Set()
  );
  const { showDeleteSuccess, openDeleteSuccess, closeDeleteSuccess } =
    useModalStore();

  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ['enrollmentHistory'],
    queryFn: async () => {
      console.log(
        '🔍 Fetching enrolled courses from /api/practice/enrolled-courses'
      );
      const response = await api.get<Course[]>(
        '/api/practice/enrolled-courses'
      );
      console.log('✅ Enrolled courses response:', response.data);
      return response.data;
    },
    retry: 1,
  });

  const visibleCourses = enrolledCourses.filter(
    (course) => !deletedCourseIds.has(course.id)
  );

  const toggleCourseSelection = (courseId: number) => {
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

  const handleDeleteSelected = () => {
    if (selectedCourses.size === 0) {
      alert('삭제할 강의를 선택해주세요.');
      return;
    }

    setDeletedCourseIds((prev) => {
      const newSet = new Set(prev);
      selectedCourses.forEach((id) => newSet.add(id));
      return newSet;
    });
    setSelectedCourses(new Set());
    openDeleteSuccess();
  };

  const totalCredit = visibleCourses.reduce(
    (sum, course) => sum + course.credit,
    0
  );

  return (
    <main className="page">
      <div className="containerX">
        <h1 className="enrollment-page-title">수강신청내역</h1>

        <div className="enrollment-left-section">
          <p className="enrollment-notice-text">
            ※ 신입생은 신입생세미나 등 일부 교과를 신청할 때 주의할 것
          </p>

          <div className="enrollment-tabs-container">
            <button
              className={`enrollment-tab-button ${activeTab === '선택삭제' ? 'active' : ''}`}
              onClick={handleDeleteSelected}
            >
              선택삭제
            </button>
            <button
              className={`enrollment-tab-button ${activeTab === '엑셀저장' ? 'active' : ''}`}
              onClick={() => setActiveTab('엑셀저장')}
            >
              엑셀저장
            </button>
            <span className="enrollment-credit-info">
              신청가능학점 <span className="enrollment-credit-number">21</span>
              학점 / 신청학점{' '}
              <span className="enrollment-credit-number">{totalCredit}</span>
              학점 / 신청과목{' '}
              <span className="enrollment-credit-number">
                {visibleCourses.length}
              </span>
              과목
            </span>
          </div>

          <div className="enrollment-content-box">
            {isLoading ? (
              <div className="enrollment-empty-state">
                <p className="enrollment-empty-text">로딩 중...</p>
              </div>
            ) : visibleCourses.length === 0 ? (
              <div className="enrollment-empty-state">
                <p className="enrollment-empty-text">
                  수강신청 내역이 없습니다.
                </p>
              </div>
            ) : (
              <div className="resultListArea">
                {visibleCourses.map((course) => {
                  const isSelected = selectedCourses.has(course.id);

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
        isOpen={showDeleteSuccess}
        onClose={closeDeleteSuccess}
        title="삭제되었습니다."
      />
    </main>
  );
}
