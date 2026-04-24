import ApiService from "../api.service";

export interface AssignmentSubmissionCreate {
  lessonId: number;
  fileId?: string | null;
  answerText?: string | null;
  comment?: string | null;
}

export interface AssignmentGradePayload {
  grade: number;
  teacherFeedback?: string | null;
}

export const AssignmentSubmissionsService = {
  Post(data: AssignmentSubmissionCreate) {
    return ApiService.post(`AssignmentSubmissions`, data);
  },
  My(params?: { lessonId?: number | null; courseId?: number | null }) {
    const parts: string[] = [];
    if (params?.lessonId) parts.push(`lessonId=${params.lessonId}`);
    if (params?.courseId) parts.push(`courseId=${params.courseId}`);
    const q = parts.length ? `?${parts.join("&")}` : "";
    return ApiService.get(`AssignmentSubmissions/my${q}`);
  },
  GetById(id: number | string) {
    return ApiService.get(`AssignmentSubmissions/${id}`);
  },
  Delete(id: number | string) {
    return ApiService.delete(`AssignmentSubmissions/${id}`);
  },
  List(query: string) {
    return ApiService.get(`AssignmentSubmissions?${query}`);
  },
  Grade(id: number | string, data: AssignmentGradePayload) {
    return ApiService.put(`AssignmentSubmissions/${id}/grade`, data);
  },
};
