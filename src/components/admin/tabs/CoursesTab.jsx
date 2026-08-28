import { CoursesTable } from '../CoursesTable';

export function CoursesTab({
  courses,
  loading,
  searchTerm,
  setSearchTerm,
  onEditCourse,
  onDeleteCourse,
  onCreateCourse
}) {
  return (
    <CoursesTable
      courses={courses}
      loading={loading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onEditCourse={onEditCourse}
      onDeleteCourse={onDeleteCourse}
      onCreateCourse={onCreateCourse}
    />
  );
}
