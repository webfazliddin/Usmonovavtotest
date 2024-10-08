import i18n, { SUPPORT_LOCALES } from "@/app/config/i18n";
import { ref } from "vue";

const availableLocales = import.meta.glob("@/app/config/i18n/locales/*.json", {
  eager: true,
});

export function useFetchI18n() {
  const loading = ref(false);
  let try_load_timer: ReturnType<typeof setTimeout>;
  let locales: {
    [key: string]: any;
  } = {};

  const getLocaleNames = async () => {
    // create object with available locale names
    for (const path in availableLocales) {
      // @ts-ignore
      const componentName: any = path.split("/").at(-1)?.split(".")[0];
      locales = {
        ...locales,
        [componentName]: {},
      };
    }
  };

  getLocaleNames();

  const loadFromStorage = () => {
    const storageLocales = localStorage.getItem("i18n");
    if (storageLocales != null) {
      for (const key in JSON.parse(storageLocales)) {
        i18n.global.setLocaleMessage(key, {
          // @ts-ignore
          ...i18n.global.messages.value[key],
          // @ts-ignore
          ...storageLocales[key],
        });
      }
    }
  };

  const fetchLang = (id: string = "") => {
    loadFromStorage();
    const fetchLoadingPromise = new Promise((resolve, reject) => {
      try {
        loading.value = true;
        fetch(`https://opensheet.elk.sh/${id}`)
          .then((res) => res.json())
          .then((res: any[]) => {
            res.forEach((item) => {
              for (const key in item) {
                const langKey =
                  key == "uz" ? "uz-cyrl" : key == "oz" ? "uz-latn" : key;

                if (SUPPORT_LOCALES.includes(langKey)) {
                  const text = item[key] ? item[key] : item?.key;
                  locales[langKey] = {
                    ...locales[langKey],
                    [item?.key]: text,
                  };
                }
              }
            });
            for (const key in locales) {
              i18n.global.setLocaleMessage(key, {
                // @ts-ignore
                ...i18n.global.messages.value[key],
                ...locales[key],
              });
            }

            resolve("success");
            localStorage.setItem("i18n", JSON.stringify(locales));
          })
          .catch((e) => {
            reject(e);
            loadFromStorage();
          })
          .finally(() => {
            loading.value = false;
          });
      } catch (e) {
        new Error(`unexpected error: ${e}`);
      }
    });

    fetchLoadingPromise.catch(() => {
      if (try_load_timer) clearInterval(try_load_timer);
      try_load_timer = setInterval(() => {
        fetchLang();
      }, 2000);
    });
  };

  return {
    fetchLang,
    getLocaleNames,
    loading,
  };
}
