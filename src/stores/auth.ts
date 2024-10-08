import { defineStore } from "pinia";
interface IFormattedRules {
  action: string;
  subject: string;
}
interface IUserInfo {
  currentOrganizationName: string;
  fullName: string;
  permissions: string[];
  shortName: string;
  userName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  region: IRegions | null;
  passportSeria: string
  livingRegion: string
  livingDistrict: string
  birthDate: string
}

interface IRegions {
  appId: number | null;
  districtId: number | null;
  districtName: string;
  regionId: number | null;
  regionName: string;
}
const DEFAULT_VALUE: IUserInfo = {
  currentOrganizationName: "",
  fullName: "",
  permissions: [],
  region: null,
  shortName: "",
  birthDate: "",
  passportSeria: "",
  livingRegion: "",
  livingDistrict: "",
  userName: "",
  firstName: "",
  lastName: "",
  middleName: "",
};

const getParsed = () => {
  let obj: IUserInfo = DEFAULT_VALUE
  try {
    let p = localStorage.getItem("user_info");
    if (p != null) {
      obj = JSON.parse(p) || DEFAULT_VALUE;
    }
  } catch {
    Object.assign(obj, DEFAULT_VALUE);
  }

  return obj;
};

export const useAuth = defineStore("auth", {
  state: () => ({
    user_info: getParsed() as IUserInfo | null,
    permissions: (getParsed() && (getParsed().permissions as string[])) || [],
    formattedRules: [] as IFormattedRules[],
    authLoading: false as boolean,
  }),
  actions: {
    LogIn(user: IUserInfo) {
      if (user) {
        this.user_info = user;
        this.permissions = user.permissions;
        if (this.permissions.length > 0) {
          this.formattedRules = this.permissions.map((per: string) => {
            const formattedObj: any = {};
            formattedObj.action = per;
            formattedObj.subject = "permissions";
            return formattedObj;
          });
        }
      }
    },
    LogOut() {
      this.user_info = null;
      this.permissions = [];
      this.formattedRules = [{ action: "read", subject: "permissions" }];
    },
    can(item: string) {
      if (this.permissions && this.permissions.includes(item)) {
        return true;
      }
      return false;
    },
  },
});
