import ApiService from "../api.service";

export const ExamService = {
  // Start exam with testTypeId (2 = marathon, 4 = exam)
  StartExam(testTypeId: number = 4) {
    return ApiService.post(`/Exams`, { testTypeId });
  },

  // Get current exam results
  GetCurrentExam() {
    return ApiService.get(`/Exams`);
  },

  // Submit answer for a question
  SubmitAnswer(attemptId: number, data: { questionId: number; choiceId: number }) {
    return ApiService.post(`/Exams/${attemptId}`, data);
  },

  // Get result for a specific attempt
  GetAttemptResult(attemptId: number) {
    return ApiService.get(`/Exams/${attemptId}`);
  },
};
