export interface CourseModel {
  id?: number;
  name: string;
  description?: string | null;
  imageFileId?: string | null;
  videoFileId?: string | null;
  resourceFileId?: string | null;
  resourceText?: string | null;
  assignmentFileId?: string | null;
  assignmentText?: string | null;
  testsCount?: number;
  lessonsCount?: number;
}

export type CourseFileFolder =
  | "coursesImage"
  | "coursesVideo"
  | "coursesResource"
  | "coursesAssignment"
  | "assignmentSubmissions";

export interface MyCourseDto {
  id: number;
  name: string;
  description: string | null;
  imageFileId: string | null;
  videoFileId: string | null;
  resourceFileId: string | null;
  resourceText: string | null;
  assignmentFileId: string | null;
  assignmentText: string | null;

  testsCount: number;
  completedTestsCount: number;
  progressPercentage: number;

  lessonsCount: number;
  completedLessonsCount: number;

  assignmentSubmissionsCount: number;
  latestSubmissionId: number | null;
  latestAttemptNumber: number | null;
  latestGrade: number | null;
  latestSubmittedAt: string | null;
  latestGradedAt: string | null;
  hasPendingSubmission: boolean;
}
