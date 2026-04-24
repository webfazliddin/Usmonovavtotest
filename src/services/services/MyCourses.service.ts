import ApiService from "../api.service";

export const MyCoursesService = {
  List() {
    return ApiService.get(`MyCourses`);
  },
  GetById(id: string | number) {
    return ApiService.get(`MyCourses/${id}`);
  },
};
