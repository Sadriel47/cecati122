import { useCourses } from '../useCourses';

export function useAdminCourses({ showToast, onCourseMutated }) {
  return useCourses({ showToast, onCourseMutated });
}
