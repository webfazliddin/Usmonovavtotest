import ApiService from "../api.service";

export const CoursesService = {
  GetCourses(query: string) {
    return ApiService.get(`Courses?${query}`);
  },
  SelectList() {
    return ApiService.get(`Courses/selectlist`);
  },
  GetById(id: string | number) {
    return ApiService.get(`Courses/${id}`);
  },
  PostCourses(data: FormData) {
    return ApiService.post(`Courses`, data);
  },
  PutCourses(data: Object, id: number | string) {
    return ApiService.put(`Courses/${id}`, data);
  },
  Delete(id: string | number) {
    return ApiService.delete(`Courses/${id}`);
  },
};
