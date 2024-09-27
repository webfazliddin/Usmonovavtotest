import ApiService from "../api.service";

export const UsersService = {
  Users() {
    return ApiService.get("Users");
  },
  Create(data: Object) {
    return ApiService.post("Users/Create", data);
  },
};
