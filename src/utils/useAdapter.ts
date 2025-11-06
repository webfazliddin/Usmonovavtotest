export function useAdapter() {
  let adapterType = "local";

  async function setAdapter(
    key?: string | undefined,
    value?: any | undefined,
    type: "local" | "session" = "local"
  ) {
    adapterType = type;
    if (!key) return;

    // Convert value to string for storage
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    if (adapterType === "local") {
      localStorage.setItem(key, stringValue);
    } else if (adapterType === "session") {
      sessionStorage.setItem(key, stringValue);
    }
  }

  function getAdapter(key: string | null, parse: boolean = true) {
    let result: any;
    if (key) {
      // Check localStorage first, then sessionStorage
      const value = localStorage.getItem(key) || sessionStorage.getItem(key);

      if (value && parse) {
        try {
          result = JSON.parse(value);
        } catch {
          result = value; // Return as string if not valid JSON
        }
      } else {
        result = value;
      }
    }
    return result;
  }

  async function killAdapter(key: string) {
    if (key) {
      // Remove from both storages
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  }

  return {
    setAdapter,
    getAdapter,
    killAdapter,
  };
}
