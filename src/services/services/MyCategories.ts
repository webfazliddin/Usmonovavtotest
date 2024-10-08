import ApiService from "../api.service";

export const MyCategoriesService = {
  MyCategories() {
    return ApiService.get(`MyCategories`);
  },
  GetMyCategory(categoryId: number) {
    return ApiService.get(`/Mycategories/${categoryId}/attempts`);
  },
  GetMyCategoryAttemp(categoryId: number, attemptId: number) {
    return ApiService.get(`/Mycategories/${categoryId}/attempts/${attemptId}`);
  },
  PostMyCategoryAttemp(categoryId: number, attemptId: number) {
    return ApiService.post(`/Mycategories/${categoryId}/attempts/${attemptId}`);
  },
};
