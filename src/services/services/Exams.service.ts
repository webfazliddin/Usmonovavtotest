import ApiService from "../api.service";

export const ExamService = {
  Exmas() {
    return ApiService.post("Exams");
  },
  PostExmas(id: string, data: any) {
    return ApiService.post(`Exams${id}`, data);
  },
};
