import ApiService from "../api.service";

export const MarksService = {
  GetMarks(query: string) {
    return ApiService.get(`Marks?${query}`);
  },
  GetById(id: string | number) {
    return ApiService.get(`Marks/${id}`);
  },
  PutMarks(data: any, id: number | string) {
    return ApiService.put(`Marks/${id}`, data);
  },
  Delete(id: string | number) {
    return ApiService.delete(`Marks/${id}`);
  },
  PostMarks(data: any, id?: number | string) {
    return ApiService.post(`Marks`, data);
  },
};
