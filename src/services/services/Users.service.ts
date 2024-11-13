import ApiService from "../api.service";

export const UsersService = {
  GetUsers(query: string) {
    return ApiService.get(`Users?${query}`);
  },
  GetById(id: string | number) {
    return ApiService.get(`Users/${id}`);
  },
  PostUsers(data: Object, id?: string | number) {
    return ApiService.post("Users/Create", data);
  },
  PutUsers(data: Object, id: number | string) {
    return ApiService.put(`Users/${id}`, data);
  },
  Delete(id: string | number) {
    return ApiService.delete(`Users/${id}`);
  },
};
