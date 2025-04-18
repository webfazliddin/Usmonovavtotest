import ApiService from "../api.service";

export const CardTestsService = {
  GetById(id: number | string) {
    return ApiService.get(`/CardTests/${id}`);
  },

  Delete(id: string | number) {
    return ApiService.delete(`CardTests/${id}`);
  },
  PutCardTests(data: any, id: number | string) {
    return ApiService.put(`CardTests/${id}`, data);
  },
  GetCardTests(query: string) {
    return ApiService.get(`CardTests?${query}`);
  },
  PostCardTests(data: any, id?: string | number) {
    return ApiService.post(`CardTests`, data);
  },
};
