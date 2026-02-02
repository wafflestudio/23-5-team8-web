import { useState } from 'react';

import type { SelectedCourseInfo } from './types';

export interface UseCourseSelectionReturn {
  selectedCourseId: number | null;
  selectedCourseInfo: SelectedCourseInfo | null;
  handleSelectCourse: (
    courseId: number,
    currentStd: number,
    maxStdCurrent: number,
    cartCount: number,
    courseTitle: string,
    courseNumber: string,
    lectureNumber: string
  ) => void;
  clear: () => void;
}

export function useCourseSelection(): UseCourseSelectionReturn {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseInfo, setSelectedCourseInfo] =
    useState<SelectedCourseInfo | null>(null);

  const handleSelectCourse = (
    courseId: number,
    currentStd: number,
    maxStdCurrent: number,
    cartCount: number,
    courseTitle: string,
    courseNumber: string,
    lectureNumber: string
  ) => {
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setSelectedCourseInfo(null);
    } else {
      setSelectedCourseId(courseId);
      setSelectedCourseInfo({
        totalCompetitors: cartCount,
        capacity: maxStdCurrent - currentStd,
        title: courseTitle,
        courseNumber: courseNumber,
        lectureNumber: lectureNumber,
      });
    }
  };

  const clear = () => {
    setSelectedCourseId(null);
    setSelectedCourseInfo(null);
  };

  return {
    selectedCourseId,
    selectedCourseInfo,
    handleSelectCourse,
    clear,
  };
}
