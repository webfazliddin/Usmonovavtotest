import { notify } from "@kyvg/vue3-notification";
import { AxiosError } from "axios";

export const setError = async (err: AxiosError<any>) => {
  const response = err.response;
  notify({
    text: response?.data.message,
    type: "error",
  });
};
