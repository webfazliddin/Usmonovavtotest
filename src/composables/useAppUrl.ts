import { ref } from "vue";

interface ITrustedHosts {
  host: string;
  sts_domain: string;
  EIMZO_URL: string;
}
const trustedHosts: ITrustedHosts[] = [
  {
    host: "https://ins.ihma.uz",
    sts_domain: "https://auth.ihma.uz",
    EIMZO_URL: "https://imzo.ihma.uz"
  },
  {
    host: "https://ins.ihma.uz",
    sts_domain: "https://auth.ihma.uz",
    EIMZO_URL: "https://imzo.ihma.uz"
  },

  {
    host: "https://tins.ihmatest.uz",
    sts_domain: "https://tauth.ihmatest.uz",
    EIMZO_URL: "https://timzo.ihmatest.uz"
  },
  {
    host: "https://tins.ihma.uz",
    sts_domain: "https://tauth.ihma.uz",
    EIMZO_URL: "https://timzo.ihma.uz"
  }
];

export const useAppUrl = () => {
  const STS_DOMAIN = ref<string>("https://auth.ihma.uz");
  const API_URL = ref<string>("https://ins.ihma.uz/api");
  const DOMAIN = ref<string>("https://ins.ihma.uz");
  const EIMZO_URL = ref<string>("https://imzo.ihma.uz");

  trustedHosts.forEach((el) => {
    if (window.location.href.indexOf(el.host) > -1) {
      STS_DOMAIN.value = el.sts_domain;
      API_URL.value = `${el.host}/api`;
      DOMAIN.value = `${el.host}`;
      EIMZO_URL.value = el.EIMZO_URL;
    }
  });

  return {
    STS_DOMAIN,
    API_URL,
    DOMAIN,
    EIMZO_URL
  };
};
