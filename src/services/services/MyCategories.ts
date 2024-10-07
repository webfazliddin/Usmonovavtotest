import ApiService from "../api.service";

export const MyCategoriesService = {
  MyCategories() {
    return ApiService.get(`MyCategories`);
  },
};
