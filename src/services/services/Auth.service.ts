import ApiService from "../api.service";

export const AuthService = {
  SignIn(data: Object) {
    return ApiService.post("Auth/signin", data);
  },
};
