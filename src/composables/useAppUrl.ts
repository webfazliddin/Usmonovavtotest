import { ref } from "vue";

export const useAppUrl = () => {
  // const API_URL = ref<string>("https://medcrm.bsite.net/api");
  const API_URL = ref<string>("https://api.usmonovavtotest.uz/api");

  return {
    API_URL,
  };
};
