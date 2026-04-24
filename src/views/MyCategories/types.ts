export interface MyCategories {
  id: number;
  name: string;
  description: string;
  attemptId: number | null;
  questionsCount: number;
  answeredCount: number;
  correctAnswerCount: number;
  progressPercentage: number;
  currentQuestionId?: number | null;

  videoFileId?: string | null;
  resourceFileId?: string | null;
  resourceText?: string | null;
  assignmentFileId?: string | null;
  assignmentText?: string | null;

  assignmentSubmissionsCount?: number;
  latestSubmissionId?: number | null;
  latestAttemptNumber?: number | null;
  latestGrade?: number | null;
  latestSubmittedAt?: string | null;
  latestGradedAt?: string | null;
  hasPendingSubmission?: boolean;
}
