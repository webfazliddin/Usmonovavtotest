import ApiService from "../api.service";

export const QuestionsService = {
  GetQuestions(query: string) {
    return ApiService.get(`Questions?${query}`);
  },
  GetById(id: string | number) {
    return ApiService.get(`Questions/${id}`);
  },
  PutQuestions(data: FormData, id: number | string) {
    return ApiService.put(`Questions/${id}`, data);
  },
  Delete(id: string | number) {
    return ApiService.delete(`Questions/${id}`);
  },
  PostQuestions(data: FormData, id?: number | string) {
    return ApiService.post(`Questions`, data);
  },
};
