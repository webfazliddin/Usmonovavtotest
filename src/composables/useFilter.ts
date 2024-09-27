import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useFilter = () => {
  const route = useRoute();
  const router = useRouter();
  const defaultNumberFilter = ref(["page", "pageSize", "totalRows"]);
  const defaultStringFilter = ref(["search", "orderType", "sortBy", "person", "pinfl"]);

  const parseFilter = (filter: object) => {
    for (const [key, value] of Object.entries(filter).values()) {
      if (value === null || typeof value === "number") {
        // @ts-ignore
        filter[key] = +route.query[key] || filter[key];
      }
      if (typeof value === "string") {
        // @ts-ignore
        filter[key] = route.query[key] || filter[key];
      }
      if (typeof value === "boolean") {
        // @ts-ignore
        filter[key] = +route.query[key] || filter[key];
      }

      if (defaultNumberFilter.value.includes(key)) {
        // @ts-ignore
        filter[key] = +route.query[key] || filter[key];
      }
      if (defaultStringFilter.value.includes(key)) {
        // @ts-ignore
        filter[key] = route.query[key] || filter[key];
      }
    }
  };

  const createRouteQuery = ({ filter, params, removeKeys }: { filter: object; params?: object; removeKeys?: string[] }) => {
    const currentRoute = router.currentRoute.value;
    let query: any = {};
    if (filter) {
      const includes = Object.keys(filter).filter((el) => !removeKeys?.includes(el));

      for (const key of includes) {
        query = {
          ...query,
          ...params,
          // @ts-ignore
          [key]: filter[key] || undefined
        };
      }

      router.replace({
        ...currentRoute,
        query
      });
    }
  };

  const setDefaultNumberFilter = (value: Object) => {
    Object.assign(defaultNumberFilter.value, value);
  };
  const setDefaultStringFilter = (value: Object) => {
    Object.assign(defaultStringFilter.value, value);
  };

  return {
    defaultNumberFilter,
    defaultStringFilter,

    parseFilter,
    setDefaultNumberFilter,
    setDefaultStringFilter,
    createRouteQuery
  };
};
