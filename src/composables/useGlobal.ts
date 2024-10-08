import { notify } from "@kyvg/vue3-notification";
import { AxiosError } from "axios";

export const useGlobal = () => {
  // const forceFileDownload = (response: any, name: string, type?: string) => {
  //   var blob = new Blob([response.data]);
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;

  //   if (type) {
  //     link.setAttribute("download", name + type);
  //   } else {
  //     link.setAttribute("download", name);
  //   }

  //   document.body.appendChild(link);
  //   link.click();
  // };

  const forceFileDownload = (response: any, name: string, type?: string) => {
    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "application/octet-stream",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    if (type) {
      link.setAttribute("download", `${name}.${type}`);
    } else {
      link.setAttribute("download", name);
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const disabledBeforeDays = (date: any) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const isoFormat = new Date(`${year}-${month + 1}-${day}T00:00`);
    return date < isoFormat;
  };

  const disableAfterTodayDays = (date: any) => {
    const today = new Date();
    return date > today;
  };

  const parseNumber = (value: number) => {
    return Intl.NumberFormat(undefined, {}).format(value);
  };

  const setError = async (err: AxiosError<any>) => {
    const response = err.response;
    const isJsonBlob = (data: any) =>
      data instanceof Blob && data.type === "application/json";
    const responseData = isJsonBlob(response?.data)
      ? await response?.data?.text()
      : response?.data || {};
    const responseJson =
      typeof responseData === "string"
        ? JSON.parse(responseData)
        : responseData;

    if (responseJson) {
      const text = (await responseJson?.text)
        ? responseJson.text()
        : responseJson;
      let parsed = JSON.parse(JSON.stringify(text));

      if (parsed && parsed?.errors) {
        for (const item in parsed?.errors) {
          notify({
            type: "error",
            text: parsed.errors[item]?.toString(),
          });
        }
      }
    }
  };

  return {
    forceFileDownload,
    disabledBeforeDays,
    disableAfterTodayDays,
    parseNumber,
    setError,
  };
};
