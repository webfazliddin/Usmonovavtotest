export interface IExamQuestion {
  id: number;
  questionText: string;
  fileId: string | null;
  description: string | null;
  choices: IExamChoice[];
}

export interface IExamChoice {
  id: number;
  choiceText: string;
}

export interface IExamAttemptData {
  attemptId: number;
  question: IExamQuestion;
  choiceId: number | null;
  isCorrect: boolean | null;
  correctChoiceId: number | null;
  canChange: boolean;
}

export interface IExamSubmitAnswer {
  questionId: number;
  choiceId: number;
}

export interface IExamResult {
  attemptId: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
}

export interface IAttemptReport {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  attemptId: number;
  testType: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  completedAt: string;
  duration: number;
}

export interface IAttemptDetails {
  attemptId: number;
  userId: number;
  userName: string;
  userEmail: string;
  testType: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  completedAt: string;
  questions: IAttemptQuestionDetail[];
}

export interface IAttemptQuestionDetail {
  questionId: number;
  questionText: string;
  fileId: string | null;
  userChoiceId: number;
  correctChoiceId: number;
  isCorrect: boolean;
  choices: IExamChoice[];
}
