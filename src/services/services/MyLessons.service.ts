import ApiService from "../api.service";

export const MyLessonsService = {
  ListByCourse(courseId: number | string) {
    return ApiService.get(`MyCourses/${courseId}/lessons`);
  },
  GetById(id: number | string) {
    return ApiService.get(`MyLessons/${id}`);
  },
};
