import ApiService from "../api.service";

export const CategoriesService = {
  GetCategories(query: string) {
    return ApiService.get(`Categories?${query}`);
  },
  GetById(id: string | number) {
    return ApiService.get(`Categories/${id}`);
  },
  SelectList() {
    return ApiService.get(`Categories/selectlist`);
  },
  PutCategories(data: FormData, id: number | string) {
    return ApiService.put(`Categories/${id}`, data);
  },
  Delete(id: string | number) {
    return ApiService.delete(`Categories/${id}`);
  },
  PostCategories(data: FormData, id?: number | string) {
    return ApiService.post(`Categories`, data);
  },
};
