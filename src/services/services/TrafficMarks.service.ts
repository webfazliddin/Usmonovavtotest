import ApiService from "../api.service";

export const TrafficMarksService = {
  GetById(id: number | string) {
    return ApiService.get(`/TrafficMarks/${id}`);
  },

  DeleteTrafficMarks(id: string | number) {
    return ApiService.delete(`TrafficMarks/${id}`);
  },
  PutTrafficMarks(data: any, id: number | string) {
    return ApiService.put(`TrafficMarks/${id}`, data);
  },
  GetTrafficMarks(query: string) {
    return ApiService.get(`TrafficMarks?${query}`);
  },
  PostTrafficMarks(data: any) {
    return ApiService.post(`TrafficMarks`, data);
  },
};
