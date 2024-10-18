export function useAdapter() {
  let adapterType = "local";
  async function setAdapter(
    key?: string | undefined,
    value?: any | undefined,
    type: "local" | "session" = "local"
  ) {
    adapterType = type;
    if (adapterType === "local" && key) {
      localStorage.setItem(key, value);
    } else {
      if (key == 'session') {
        sessionStorage.setItem(key, value);
      }
    }
  }

   function getAdapter(key: string | null) {
    let result: any;
    if (key) {
      if (localStorage.getItem(key)) {
        result =  localStorage.getItem(key);
      } else {
        result =  sessionStorage.getItem(key);
      }
    }
    return  result;
  }

  async function killAdapter(key: string) {
    if (key) {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
    }
  }
  return {
    setAdapter,
    getAdapter,
    killAdapter,
  };
}
