import ApiService from "../api.service";

export const MarkCategoryService = {
  GetMarkCategory(query: string) {
    return ApiService.get(`MarkCategories?${query}`);
  },
  GetById(id: string | number) {
    return ApiService.get(`MarkCategories/${id}`);
  },
  SelectList() {
    return ApiService.get(`MarkCategories/selectlist`);
  },
  PutMarkCategory(data: Object, id: number | string) {
    return ApiService.put(`MarkCategories/${id}`, data);
  },
  Delete(id: string | number) {
    return ApiService.delete(`MarkCategories/${id}`);
  },
  PostMarkCategory(data: FormData, id?: number | string) {
    return ApiService.post(`MarkCategories`, data);
  },
};
