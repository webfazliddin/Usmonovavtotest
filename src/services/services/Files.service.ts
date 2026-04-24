import ApiService from "../api.service";
import { useAppUrl } from "@/composables/useAppUrl";

export const FilesService = {
  PostFiles(data: FormData) {
    return ApiService.post("Files", data);
  },
  GetFiles(fileName: string, folder?: string) {
    const qs = folder ? `fileName=${fileName}&folder=${folder}` : `fileName=${fileName}`;
    return ApiService.get(`Files?${qs}`);
  },
  buildFileUrl(fileName: string, folder?: string): string {
    const { API_URL } = useAppUrl();
    const base = API_URL.value.replace(/\/$/, "");
    const qs = folder ? `fileName=${encodeURIComponent(fileName)}&folder=${folder}` : `fileName=${encodeURIComponent(fileName)}`;
    return `${base}/Files?${qs}`;
  },
};
