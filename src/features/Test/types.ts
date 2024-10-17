export interface MyCategories {
  id: number;
  name: string;
  description: string;
  attemptId: number | null;
  questionsCount: number;
  answeredCount: number;
  correctAnswerCount: number;
}

export interface ICategoryAttemp {
  data: ICategoryAttempData[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface ICategoryAttempData {
  attemptId: number;
  question: ICategoryAttempDataQuestion;
  choiceId: number | null;
  isCorrect: boolean | null;
}

export interface ICategoryAttempDataQuestion {
  id: number;
  questionText: string;
  description: string;
  fileId: number | null;
  fileBase64: number | null;
  choices: ICategoryAttempDataQuestionChoice[];
}

export interface ICategoryAttempDataQuestionChoice {
  id: number;
  questionId: number;
  choiceText: string;
}

export interface IPostAttemp {
  questionId: number | null;
  choiceId: number | null;
}
