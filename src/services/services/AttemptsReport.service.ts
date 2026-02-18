import ApiService from "../api.service";

export const AttemptsReportService = {
  // Get all users attempts report (with pagination and filters)
  GetUsersAttemptsReport(params?: {
    page?: number;
    size?: number;
    search?: string;
    testTypeId?: number;
  }) {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('Page', params.page.toString());
    if (params?.size) queryParams.append('Size', params.size.toString());
    if (params?.search) queryParams.append('Search', params.search);
    if (params?.testTypeId) queryParams.append('TestTypeId', params.testTypeId.toString());

    const queryString = queryParams.toString();
    const url = `/AttemptsReport/GetUsersAttemptsReport${queryString ? `?${queryString}` : ''}`;

    return ApiService.get(url);
  },

  // Get detailed report for a specific user's attempts
  GetUserAttemptDetails(userId: number, testTypeId?: number) {
    const queryParams = new URLSearchParams();
    queryParams.append('userId', userId.toString());
    if (testTypeId) queryParams.append('testTypeId', testTypeId.toString());

    return ApiService.get(`/AttemptsReport/GetUserAttemptDetails?${queryParams.toString()}`);
  },
};
