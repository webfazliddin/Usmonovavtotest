import ApiService from "../api.service";

export const CardService = {
  GetCards() {
    return ApiService.get("Cards");
  },
  GetCard(id: number | string) {
    return ApiService.get(`Cards/${id}`);
  },
  GetAttemp(id: number | string, result: any) {
    return ApiService.post(`Cards/${id}`, result);
  },
};
