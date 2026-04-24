export interface LessonModel {
  id?: number;
  courseId: number;
  name: string;
  description?: string | null;
  orderCode?: number;
  videoFileId?: string | null;
  resourceFileId?: string | null;
  resourceText?: string | null;
  assignmentFileId?: string | null;
  assignmentText?: string | null;
}

export type LessonFileFolder =
  | "lessonsVideo"
  | "lessonsResource"
  | "lessonsAssignment"
  | "assignmentSubmissions";

export interface MyLessonDto {
  id: number;
  courseId: number;
  name: string;
  description: string | null;
  orderCode: number;
  videoFileId: string | null;
  resourceFileId: string | null;
  resourceText: string | null;
  assignmentFileId: string | null;
  assignmentText: string | null;

  testsCount: number;
  completedTestsCount: number;
  progressPercentage: number;

  assignmentSubmissionsCount: number;
  latestSubmissionId: number | null;
  latestAttemptNumber: number | null;
  latestGrade: number | null;
  latestSubmittedAt: string | null;
  latestGradedAt: string | null;
  hasPendingSubmission: boolean;
}
