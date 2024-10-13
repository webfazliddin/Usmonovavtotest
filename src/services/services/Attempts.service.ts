import ApiService from "../api.service";

export const AttemptService = {
  StartQuestion(query: string) {
    return ApiService.get(`MyCategories${query}`);
  },
  SaveQuestion(query: string, data: any) {
    return ApiService.get(`MyCategories${query}`, data);
  },
};
