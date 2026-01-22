import {useState} from 'react';
import '../css/enrollmentHistory.css';
import {useQuery} from '@tanstack/react-query';
import {getPracticeResultApi} from '../api/registration';
import {searchCoursesApi} from '../api/courses';
import type {PracticeAttemptDetail, Course} from '../types/apiTypes';
import {useModalStore} from '../stores/modalStore';
import DeleteSuccessModal from '../utils/deleteSuccessModal';

interface EnrolledCourse extends PracticeAttemptDetail {
  course: Course;
}

export default function EnrollmentHistory() {
  const [activeTab, setActiveTab] = useState('선택삭제');
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [deletedCourseIds, setDeletedCourseIds] = useState<Set<number>>(new Set());
  const {showDeleteSuccess, openDeleteSuccess, closeDeleteSuccess} = useModalStore();

  const practiceLogId = localStorage.getItem('currentPracticeLogId');

  const {data: enrolledCourses = [], isLoading} = useQuery({
    queryKey: ['enrollmentHistory', practiceLogId],
    queryFn: async () => {
      if (!practiceLogId) {
        return [];
      }

      const resultResponse = await getPracticeResultApi(Number(practiceLogId));
      const attempts = resultResponse.data.attempts;
      const successfulAttempts = attempts.filter(
        (attempt: PracticeAttemptDetail) => attempt.isSuccess
      );

      const coursesWithDetails = await Promise.all(
        successfulAttempts.map(async (attempt: PracticeAttemptDetail) => {
          try {
            const searchResponse = await searchCoursesApi({
              query: attempt.courseTitle,
              page: 0,
              size: 100,
            });

            const matchedCourse = searchResponse.data.items.find(
              (course) =>
                course.id === attempt.courseId && course.lectureNumber === attempt.lectureNumber
            );

            if (matchedCourse) {
              return {
                ...attempt,
                course: matchedCourse,
              } as EnrolledCourse;
            }

            const courseByIdMatch = searchResponse.data.items.find(
              (course) => course.id === attempt.courseId
            );

            if (courseByIdMatch) {
              return {
                ...attempt,
                course: courseByIdMatch,
              } as EnrolledCourse;
            }

            console.warn(
              `[EnrollmentHistory] 강의를 찾을 수 없습니다: ${attempt.courseTitle} (ID: ${attempt.courseId})`
            );
            return null;
          } catch (error) {
            console.error(
              `[EnrollmentHistory] 강의 정보 조회 실패 (courseId: ${attempt.courseId}):`,
              error
            );
            return null;
          }
        })
      );

      return coursesWithDetails.filter((course): course is EnrolledCourse => course !== null);
    },
    enabled: !!practiceLogId,
    retry: false,
  });

  const visibleCourses = enrolledCourses.filter((course) => !deletedCourseIds.has(course.courseId));

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

  const totalCredit = visibleCourses.reduce((sum, item) => sum + item.course.credit, 0);

  return (
    <main className='page'>
      <div className='containerX'>
        <h1 className='enrollment-page-title'>수강신청내역</h1>

        <div className='enrollment-left-section'>
          <p className='enrollment-notice-text'>
            ※ 신입생은 신입생세미나 등 일부 교과를 신청할 때 주의할 것
          </p>

          <div className='enrollment-tabs-container'>
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
            <span className='enrollment-credit-info'>
              신청가능학점 <span className='enrollment-credit-number'>21</span>
              학점 / 신청학점 <span className='enrollment-credit-number'>{totalCredit}</span>
              학점 / 신청과목 <span className='enrollment-credit-number'>
                {visibleCourses.length}
              </span>
              과목
            </span>
          </div>

          <div className='enrollment-content-box'>
            {isLoading ? (
              <div className='enrollment-empty-state'>
                <p className='enrollment-empty-text'>로딩 중...</p>
              </div>
            ) : visibleCourses.length === 0 ? (
              <div className='enrollment-empty-state'>
                <p className='enrollment-empty-text'>수강신청 내역이 없습니다.</p>
              </div>
            ) : (
              <div className='resultListArea'>
                {visibleCourses.map((item) => {
                  const isSelected = selectedCourses.has(item.courseId);

                  return (
                    <div
                      key={item.courseId}
                      className='courseItem'
                      onClick={() => toggleCourseSelection(item.courseId)}
                    >
                      <div className='courseCheckArea'>
                        <button
                          className={`customCheckBtn ${isSelected ? 'checked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCourseSelection(item.courseId);
                          }}
                        >
                          <svg
                            className='checkIcon'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <polyline points='20 6 9 17 4 12' />
                          </svg>
                        </button>
                      </div>

                      <div className='courseInfoArea'>
                        <div className='infoRow'>
                          <span className='c-type'>
                            [{item.course.academicCourse === '학사' ? '학사' : '대학원'}] [
                            {item.course.classification}]
                          </span>
                          <span className='c-title'>{item.course.courseTitle}</span>
                        </div>
                        <div className='infoRow'>
                          <span className='c-prof'>{item.course.instructor}</span>
                          <span className='c-divider'>|</span>
                          <span className='c-dept'>{item.course.department}</span>
                          <span className='c-divider'>|</span>
                          <span className='c-coursenum'>
                            {item.course.courseNumber}
                            {item.course.lectureNumber && `(${item.course.lectureNumber})`}
                          </span>
                        </div>
                        <div className='infoRow'>
                          <span className='c-label'>수강신청인원/정원(재학생)</span>
                          <span className='c-val-blue'>
                            {item.rank}/{item.course.quota} ({item.course.quota})
                          </span>
                          <span className='c-divider-light'>|</span>
                          <span className='c-label'>총수강인원</span>
                          <span className='c-val-blue'>{item.rank}</span>
                          <span className='c-divider-light'>|</span>
                          <span className='c-label'>학점</span>
                          <span className='c-val-blue'>{item.course.credit}</span>
                          <span className='c-divider-light'>|</span>
                          <span className='c-schedule'>
                            {item.course.placeAndTime
                              ? JSON.parse(item.course.placeAndTime).time || '시간 미정'
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

      <DeleteSuccessModal isOpen={showDeleteSuccess} onClose={closeDeleteSuccess} />
    </main>
  );
}
