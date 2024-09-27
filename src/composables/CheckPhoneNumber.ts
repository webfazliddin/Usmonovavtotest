import i18n from "@/app/config/i18n";
export const useCheckPhoneNumber = () => {
  let regex = /[(),-]/g;
  const set = (value: string | null) => {
    return value && value.toString().split(" ").join("").replace(regex, "");
  };

  const phoneNumberRules = [
    (value: any) => {
      if (value) {
        const newValue = String(value).split("+998");
        const phone = set(newValue[1]);
        if (phone?.length !== 9) {
          return i18n.global.t("invalidFormatPhoneNumber");
        }
        return true;
      }

      return i18n.global.t("fieldNotEmpty");
    }
  ];
  const notRequiredPhoneNumberRules = [
    (value: any) => {
      if (value) {
        if (String(value).length > 4) {
          const newValue = String(value).split("+998");
          const phone = set(newValue[1]);
          if (phone?.length !== 9) {
            return i18n.global.t("invalidFormatPhoneNumber");
          }
          return true;
        }

        return i18n.global.t("fieldNotEmpty");
      }

      return true;
    }
  ];

  const setIsRequiredPhoneNumber = (value: any) => {
    const val = value ?? "";
    if (String(val).length > 0) {
      return true;
    }
    return false;
  };

  return {
    phoneNumberRules,
    notRequiredPhoneNumberRules,
    setIsRequiredPhoneNumber,
    set
  };
};
