import { PageHeader } from '../../components/PageHeader.jsx';
import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { EmptyState } from '../../components/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { calcAge, formatDate, formatMAD, MIN_AGE_BY_CATEGORY } from '../../utils/helpers.js';

const BrowseCourses = () => {
  const { auth } = useAuth();
  const { state, enrollStudentInCourse } = useAppData();
  const { t } = useLanguage();
  const student = state.students.find((s) => s.id === auth.studentId);

  const isEnrolled = (courseId) => state.enrollments.some((e) => e.studentId === student.id && e.courseId === courseId);
  const meetsAge = (course) => calcAge(student.dob) >= (MIN_AGE_BY_CATEGORY[course.category] || 18);
  const seatsUsed = (courseId) => state.enrollments.filter((e) => e.courseId === courseId && e.status === 'active').length;

  return (
    <>
      <PageHeader title={t('browseCourses.title')} subtitle={t('browseCourses.subtitle')} />
      <div className="flex-1 p-6 md:p-8">
        {state.courses.length === 0 ? (
          <Card><EmptyState title={t('browseCourses.empty')} /></Card>
        ) : (
          <div className="flex flex-col gap-4">
            {state.courses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const ageOk = meetsAge(course);
              return (
                <Card key={course.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold">{course.name}</h3>
                      <Badge variant="primary">{course.category}</Badge>
                      <Badge variant={course.status === 'open' ? 'success' : 'neutral'}>{course.status === 'open' ? t('common.open') : t('common.closed')}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {course.theoryHours}h · {course.practiceHours}h · {t('browseCourses.startsOn')} {formatDate(course.startDate)} · {seatsUsed(course.id)} {t('browseCourses.enrolledCount')}
                    </p>
                    <p className="mt-1.5 text-sm">
                      <strong>{formatMAD(course.price)}</strong> — {course.paymentPlan.type === 'full' ? t('courses.full') : `${course.paymentPlan.installments} ${t('courses.installments')}`}
                    </p>
                    {!ageOk && (
                      <p className="mt-1.5 text-xs text-destructive">
                        {t('browseCourses.ageWarn', { category: course.category, age: MIN_AGE_BY_CATEGORY[course.category] })}
                      </p>
                    )}
                  </div>
                  <div>
                    {enrolled ? (
                      <Badge variant="success">{t('browseCourses.enrolled')}</Badge>
                    ) : (
                      <Button
                        variant="accent"
                        disabled={course.status !== 'open' || !ageOk}
                        onClick={() => enrollStudentInCourse(student.id, course.id)}
                      >
                        {t('browseCourses.enroll')}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default BrowseCourses;
