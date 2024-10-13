import ApiService from "../api.service";

export const MyCategoriesService = {
  MyCategories() {
    return ApiService.get(`MyCategories`);
  },
  GetMyCategory(categoryId: number) {
    return ApiService.get(`/Mycategories/${categoryId}/attempts`);
  },
};
