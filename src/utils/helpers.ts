import { notify } from "@kyvg/vue3-notification";
import { AxiosError } from "axios";

export const setError = async (err: AxiosError<any>) => {
    const response = err.response;
    const isJsonBlob = (data: any) => data instanceof Blob && data.type === "application/json";
    const responseData = isJsonBlob(response?.data) ? await response?.data?.text() : response?.data || {};
    const responseJson = typeof responseData === "string" ? JSON.parse(responseData) : responseData;

    if (responseJson) {
      const text = await responseJson?.text ? responseJson.text() : responseJson
      let parsed = JSON.parse(JSON.stringify(text));

      if (parsed && parsed?.errors) {
        for (const item in parsed?.errors) {
          notify({
            type: "error",
            text: parsed.errors[item]?.toString()
          });
        }
      }
    }
  };
  export const setCustomError = (text: string, type: string) => {
    if (type == "error") {
      notify({
        type: "error",
        text: text
      });      
    } else if (type == "warn") {
      notify({
        type: "warn",
        text: text
      });          
    }
  }