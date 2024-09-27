import ApiService from "../api.service";

export const QuestionsService = {
  GetQuestions(query: string) {
    return ApiService.get(`Questions?${query}`);
  },
  GetById(id: string | number) {
    return ApiService.get(`Questions/${id}`);
  },
  PutQuestions(data: Object) {
    return ApiService.put(`Questions`, data);
  },
  DeleteQuestions(id: string | number) {
    return ApiService.delete(`Questions/${id}`);
  },
  PostQuestions(data: FormData) {
    return ApiService.post(`Questions`, data);
  },
};
