import {useState} from 'react';
import {
  useCartQuery,
  useDeleteFromCartMutation,
  useUpdateCartCountMutation,
} from '../hooks/useCartQuery';
import {useModalStore} from '../stores/modalStore';
import {isAxiosError} from 'axios';
import Warning from '../utils/Warning';

export default function Cart() {
  const {data: cartCourses = [], isLoading} = useCartQuery();
  const deleteFromCartMutation = useDeleteFromCartMutation();
  const updateCartCountMutation = useUpdateCartCountMutation();
  const {showDeleteSuccess, openDeleteSuccess, closeDeleteSuccess} = useModalStore();

  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [editingValues, setEditingValues] = useState<Map<number, string>>(new Map());
  const [showNoCourseSelected, setShowNoCourseSelected] = useState(false);

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

  const handleDeleteSelected = async () => {
    if (selectedCourses.size === 0) {
      setShowNoCourseSelected(true);
      return;
    }

    try {
      const promises = Array.from(selectedCourses).map((courseId) =>
        deleteFromCartMutation.mutateAsync(courseId)
      );
      await Promise.all(promises);
      openDeleteSuccess();
      setSelectedCourses(new Set());
    } catch (error) {
      console.error('[Cart] 장바구니 삭제 실패:', error);
      if (isAxiosError(error) && error.response) {
        alert(`삭제 실패: ${error.response.data.message || '알 수 없는 오류'}`);
      } else {
        alert('삭제 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleCartCountChange = async (courseId: number, newValue: string) => {
    const newCount = parseInt(newValue);
    if (isNaN(newCount) || newCount < 0) {
      return;
    }

    try {
      await updateCartCountMutation.mutateAsync({
        courseId,
        data: {cartCount: newCount},
      });
    } catch (error) {
      console.error('[Cart] cartCount 수정 실패:', error);
      if (isAxiosError(error) && error.response) {
        alert(`수정 실패: ${error.response.data.message || '알 수 없는 오류'}`);
      }
    }
  };

  const totalCredit = cartCourses.reduce((sum, item) => sum + item.course.credit, 0);

  return (
    <main className='page'>
      <div className='containerX'>
        <h1 className='cart-page-title'>장바구니</h1>

        <div className='cart-notice-box'>
          <div className='cart-notice-left'>
            <p className='cart-notice-date'>2026년 01월 27일 09:00~23:59</p>
            <p className='cart-notice-date'>2026년 01월 28일 00:00~16:00</p>
          </div>
          <div className='cart-notice-right'>
            <p className='cart-notice'>
              ※ 마감시간 이후에는 변경이 불가하며, 인원충족 시 전산확정 됩니다.
            </p>
            <p className='cart-notice'>
              ※ 장바구니 담기 기간 이후의 변동내역은 장바구니에 적용되지 않습니다.
            </p>
          </div>
        </div>

        <div className='cart-left-section'>
          <div className='cart-tabs-container'>
            <button className='cart-tab-button active' onClick={handleDeleteSelected}>
              선택삭제
            </button>
            <button className='cart-tab-button'>
              관심강좌
              <img src='/assets/btn_arrow_view_gray.png' alt='' className='cart-btn-arrow' />
            </button>
            <button className='cart-tab-button'>
              전공이수내역조회
              <img src='/assets/btn_arrow_view_gray.png' alt='' className='cart-btn-arrow' />
            </button>
            <span className='cart-credit-info'>
              신청가능학점 <span className='cart-credit-number'>21</span>
              학점 / 담은 학점 <span className='cart-credit-number'>{totalCredit}</span>
              학점
            </span>
          </div>

          <div className='cart-content-box'>
            {isLoading ? (
              <div className='cart-empty-state'>
                <p className='cart-empty-title'>로딩 중...</p>
              </div>
            ) : cartCourses.length === 0 ? (
              <div className='cart-empty-state'>
                <p className='cart-empty-title'>장바구니가 비었습니다.</p>
                <p className='cart-empty-desc'>
                  검색 또는 관심강좌에서 수강신청 하실 강좌를 장바구니에 담으세요.
                </p>
              </div>
            ) : (
              <div className='resultListArea'>
                {cartCourses.map((item) => {
                  const isSelected = selectedCourses.has(item.course.id);

                  return (
                    <div
                      key={item.preEnrollId}
                      className='courseItem'
                      onClick={() => toggleCourseSelection(item.course.id)}
                    >
                      <div className='courseCheckArea'>
                        <button
                          className={`customCheckBtn ${isSelected ? 'checked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCourseSelection(item.course.id);
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
                            0/{item.course.quota} ({item.course.quota})
                          </span>
                          <span className='c-divider-light'>|</span>
                          <span className='c-label'>총수강인원</span>
                          <span className='c-val-blue'>0</span>
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

                      <div className='courseActionArea'>
                        <div className='cartInfoBox'>
                          <svg
                            className='cartIconSvg'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                          >
                            <circle cx='9' cy='21' r='1' />
                            <circle cx='20' cy='21' r='1' />
                            <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
                          </svg>
                          <input
                            type='number'
                            value={
                              editingValues.has(item.course.id)
                                ? editingValues.get(item.course.id)
                                : item.cartCount
                            }
                            onChange={(e) => {
                              e.stopPropagation();
                              const newValue = e.target.value;
                              setEditingValues((prev) => {
                                const newMap = new Map(prev);
                                newMap.set(item.course.id, newValue);
                                return newMap;
                              });
                            }}
                            onBlur={(e) => {
                              e.stopPropagation();
                              if (editingValues.has(item.course.id)) {
                                const value = editingValues.get(item.course.id)!;
                                const finalValue = value === '' ? '0' : value;
                                handleCartCountChange(item.course.id, finalValue);
                                setEditingValues((prev) => {
                                  const newMap = new Map(prev);
                                  newMap.delete(item.course.id);
                                  return newMap;
                                });
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className='cartCountInput'
                            min='0'
                            style={{
                              width: '40px',
                              height: '24px',
                              textAlign: 'center',
                              fontSize: '14px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              padding: '2px',
                              marginLeft: '4px',
                            }}
                          />
                        </div>
                        <div className='arrowBox'>
                          <svg width='10' height='16' viewBox='0 0 10 16' fill='none'>
                            <path
                              d='M1 1L8 8L1 15'
                              stroke='#aaa'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
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

      <Warning
        variant="single"
        icon="warning"
        isOpen={showDeleteSuccess}
        onClose={closeDeleteSuccess}
        title="삭제되었습니다."
      />

      <Warning
        variant="single"
        icon="warning"
        isOpen={showNoCourseSelected}
        onClose={() => setShowNoCourseSelected(false)}
      >
        <p className="warningText">삭제할 강좌를 선택해주십시오.</p>
      </Warning>
    </main>
  );
}
