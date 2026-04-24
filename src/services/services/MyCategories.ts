import ApiService from "../api.service";

export const MyCategoriesService = {
  MyCategories() {
    return ApiService.get(`MyCategories`);
  },
  GetById(id: number | string) {
    return ApiService.get(`MyCategories/${id}`);
  },
  GetMyCategory(categoryId: number) {
    return ApiService.get(`/Mycategories/${categoryId}/attempts`);
  },
};
