import ApiService from "../api.service";

export const AttemptsReportService = {
  // Get all users attempts report (with pagination)
  GetUsersAttemptsReport(params?: { page?: number; size?: number; search?: string }) {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('Page', params.page.toString());
    if (params?.size) queryParams.append('Size', params.size.toString());
    if (params?.search) queryParams.append('Search', params.search);

    const queryString = queryParams.toString();
    return ApiService.get(`/AttemptsReport/GetUsersAttemptsReport${queryString ? `?${queryString}` : ''}`);
  },

  // Get detailed report for a specific user attempt
  GetUserAttemptDetails(attemptId: number) {
    return ApiService.get(`/AttemptsReport/GetUserAttemptDetails?attemptId=${attemptId}`);
  },
};
