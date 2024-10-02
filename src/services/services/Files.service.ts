import ApiService from "../api.service";

export const FilesService = {
  PostFiles(data: FormData) {
    return ApiService.post("Files", data);
  },
  GetFiles(fileName: string) {
    return ApiService.get(`Files?fileName=${fileName}`);
  },
};
