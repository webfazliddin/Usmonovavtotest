import ApiService from "../api.service";

export interface AttemptItem {
  id: number;
  startedDate: string;
  isActive: boolean;
  cardTestShortName: string | null;
  cardTestId?: number;
  lessonId: number;
  lessonName: string | null;
  questionsCount: number;
  answeredCount: number;
  correctAnswerCount: number;
  scorePercent: number;
  // admin-only extras
  userId?: number;
  userName?: string;
  userFullName?: string;
}

export const MyAttemptsService = {
  // Student
  ByCourse(courseId: number | string) {
    return ApiService.get(`MyCourses/${courseId}/attempts`);
  },
  ByLesson(lessonId: number | string) {
    return ApiService.get(`MyLessons/${lessonId}/attempts`);
  },
  // Admin
  AdminByCourse(
    courseId: number | string,
    params?: { userId?: number | null; lessonId?: number | null },
  ) {
    const qs: string[] = [];
    if (params?.userId) qs.push(`userId=${params.userId}`);
    if (params?.lessonId) qs.push(`lessonId=${params.lessonId}`);
    const q = qs.length ? `?${qs.join("&")}` : "";
    return ApiService.get(`Courses/${courseId}/attempts${q}`);
  },
};
