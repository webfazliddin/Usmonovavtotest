import ApiService from "../api.service";

export const CardService = {
  GetCards() {
    return ApiService.get("Cards");
  },
  GetCard(id: number | string) {
    return ApiService.get(`Cards/${id}`);
  },
  DefaultResult(attempId: number | string) {
    return ApiService.get(`Cards/defualt-result/${attempId}`);
  },
  Result(attempId: number | string) {
    return ApiService.get(`Cards/result/${attempId}`);
  },
  GetAttemp(cardId: number | string, id: number | string, result: any) {
    return ApiService.post(`Cards/${cardId}/${id}`, result);
  },
};
