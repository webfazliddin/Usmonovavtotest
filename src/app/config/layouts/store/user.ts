import { defineStore } from "pinia";

interface IState {
  isAdmin: boolean;
}

// Helper function to get isAdmin from storage (checks both localStorage and sessionStorage)
function getIsAdminFromStorage(): boolean {
  const localValue = localStorage.getItem("isAdmin");
  const sessionValue = sessionStorage.getItem("isAdmin");
  const value = localValue || sessionValue;

  if (value) {
    try {
      return JSON.parse(value);
    } catch {
      return value === 'true';
    }
  }
  return false;
}

export const useUserStore = defineStore({
  id: "userData",
  state: (): IState => ({
    isAdmin: getIsAdminFromStorage(),
  }),
  getters: {
    getIsAdmin(): boolean {
      return this.isAdmin;
    },
  },
  actions: {
    setIsAdmin(payload: boolean) {
      this.isAdmin = payload;
    },
  },
});
