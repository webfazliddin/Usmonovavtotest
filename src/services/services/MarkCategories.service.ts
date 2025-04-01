import ApiService from "../api.service";

export const MarkCategoriesService = {
  GetById(id: number | string) {
    return ApiService.get(`/MarkCategories/${id}`);
  },

  DeleteMarkCategories(id: string | number) {
    return ApiService.delete(`MarkCategories/${id}`);
  },
  PutMarkCategories(data: any, id: number | string) {
    return ApiService.put(`MarkCategories/${id}`, data);
  },
  GetMarkCategories(query: string) {
    return ApiService.get(`MarkCategories?${query}`);
  },
  PostMarkCategories(data: any) {
    return ApiService.post(`MarkCategories`, data);
  },
  MarkCategoriesSelectlist() {
    return ApiService.get(`MarkCategories`);
  },
};
