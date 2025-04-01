import ApiService from "../api.service";

export const CardService = {
  GetCards() {
    return ApiService.get("Cards");
  },
};
