import ApiService from "../api.service";

export const LessonsService = {
  GetByCourse(courseId: number | string, query = "") {
    const qs = query ? `?${query}` : "";
    return ApiService.get(`Courses/${courseId}/lessons${qs}`);
  },
  List(query: string) {
    return ApiService.get(`Lessons?${query}`);
  },
  GetById(id: number | string) {
    return ApiService.get(`Lessons/${id}`);
  },
  PostLesson(data: FormData) {
    return ApiService.post(`Lessons`, data);
  },
  PutLesson(data: Object, id: number | string) {
    return ApiService.put(`Lessons/${id}`, data);
  },
  Delete(id: number | string) {
    return ApiService.delete(`Lessons/${id}`);
  },
};
