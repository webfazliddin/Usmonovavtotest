import { useAdapter } from "@/utils/useAdapter";
import { defineStore } from "pinia";
const {getAdapter} = useAdapter()

export const useUserStore = defineStore({
  id: "userData",
  state: () => ({
    isAdmin: getAdapter('isAdmin') as any
  }), 
  actions: {
    setIsAdmin(payload:boolean) {
      this.isAdmin = payload
    },
}
}) 