export interface MyCategories {
  id: number;
  name: string;
  description: string;
  attemptId: number | null;
  questionsCount: number;
  answeredCount: number;
  correctAnswerCount: number;
}