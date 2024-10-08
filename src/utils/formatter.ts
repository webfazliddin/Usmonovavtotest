// @ts-check

import i18n from "@/app/config/i18n";

export function useFormatter() {
  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
    );
  };
  const isYesterday = (someDate: Date) => {
    const today = new Date();
    let yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);
    return (
      someDate.getDate() == yesterday.getDate() &&
      someDate.getMonth() == yesterday.getMonth() &&
      someDate.getFullYear() == yesterday.getFullYear()
    );
  };

  const handleDateIso = (d: string | Date) => {
    const day: number = parseInt(String(d).split(".")[0]);
    const month = String(d).split(".")[1];
    const year: number = parseInt(String(d).split(".")[2]);

    const fullYear = new Date(`${year}-${month}-${day}`);

    return fullYear;
  };
  const secondsToHms = (d: number) => {
    
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);
    if (h !== 0) {
      return (
        ("0" + h).slice(-2) +
        ":" +
        ("0" + m).slice(-2) +
        ":" +
        ("0" + s).slice(-2)
      );
    } else {
      return ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
    }
  };

  const isTomorrow = (someDate: Date) => {
    const today = new Date();
    let tomorrow = new Date();

    tomorrow.setDate(today.getDate() + 1);
    return (
      someDate.getDate() == tomorrow.getDate() &&
      someDate.getMonth() == tomorrow.getMonth() &&
      someDate.getFullYear() == tomorrow.getFullYear()
    );
  };

  const handleDate = (value: string, format = "dd.mm.yyyy") => {
    const dateObj = new Date(value);
    const months = [
      i18n.global.t("january"),
      i18n.global.t("february"),
      i18n.global.t("march"),
      i18n.global.t("april"),
      i18n.global.t("may"),
      i18n.global.t("june"),
      i18n.global.t("july"),
      i18n.global.t("august"),
      i18n.global.t("september"),
      i18n.global.t("october"),
      i18n.global.t("november"),
      i18n.global.t("december"),
    ];
    switch (format) {
      case "dd":
        return `${("0" + dateObj.getDate()).substr(-2)}`;
      case "mmmm":
        return `${months[dateObj.getMonth()]}`;
      case "dd mmmm":
        return `${("0" + dateObj.getDate()).substr(-2)} ${
          months[dateObj.getMonth()]
        }`;
      case "dddd":
        return isToday(dateObj)
          ? i18n.global.t("days.today")
          : isYesterday(dateObj)
          ? i18n.global.t("days.yesterday")
          : i18n.global.t("days." + dateObj.getDay());
      case "week":
        return isToday(dateObj)
          ? i18n.global.t("today")
          : isYesterday(dateObj)
          ? i18n.global.t("yesterday")
          : isTomorrow(dateObj)
          ? i18n.global.t("tomorrow")
          : `${("0" + dateObj.getDate()).substr(-2)}.${("0" + (dateObj.getMonth() + 1)).substr(-2)}.${dateObj.getFullYear()}`
      default:
        return `${("0" + dateObj.getDate()).substr(-2)}.${(
          "0" +
          (dateObj.getMonth() + 1)
        ).substr(-2)}.${dateObj.getFullYear()}`;
    }
  };

  const handleTime = (value: string, format = "hh:mm") => {
    const dateObj = new Date(value);
    switch (format) {
      // case 'dd.mm.yyyy':
      //   break;
      default:
        return `${("0" + dateObj.getHours()).substr(-2)}:${(
          "0" + dateObj.getMinutes()
        ).substr(-2)}`;
    }
  };

  const handleHms = (value: any, format = "hh:mm:ss") => {
    const h = Math.floor(value / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = Math.floor((value % 3600) % 60);   
    switch (format) {
      case "hh":
        return ` ${h + i18n.global.t("hms.h")}.`;
      case "mm":
        return ` ${m + i18n.global.t("hms.m")}.`;

      default:
        if (h !== 0) {
          switch (format) {
            default:
              return ` ${h + i18n.global.t("hms.h")}. ${
                m + i18n.global.t("hms.m")
              }. `;
          }
        } else {
          return `${m.toString().slice(-2) + i18n.global.t(`hms.m`)} ${
            s.toString().slice(-2) + i18n.global.t("hms.s")
          }`;
        }
    }
  };

  const capitalize = (string: string) => {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const moveArrayItemToNewIndex = (
    arr: any[],
    old_index: number,
    new_index: number
  ) => {
    if (new_index! >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  };

  const removeItemFromArray = (arr: any[], value: any, byIndex = true) => {
    if (byIndex) {
      arr.splice(value, 1);
    } else {
      const index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
  };

  const getImageUrl = (name: string) => {
    return new URL(`../assets/${name}`, import.meta.url).href;
  };

  const getDatesBetweenDates = (startDate: any, endDate: any) => {
    let dates: Date[] = [];
    //to avoid modifying the original date
    const theDate = new Date(startDate);

    while (theDate < endDate) {
      dates = [...dates, new Date(theDate)];
      theDate.setDate(theDate.getDate() + 1);
    }
    dates = [...dates, endDate];

    return dates;
  };

  function dateRange(startDate: any, endDate: any) {
    var start = new Date(startDate);
    var startYear = start.getFullYear();
    var end = new Date(endDate);
    var endYear = end.getFullYear();
    var dates = [];
    for (var i = startYear; i <= endYear; i++) {
      let endMonth = i !== endYear ? 11 : end.getMonth() - 1;
      let startMonth = i === startYear ? start.getMonth() - 1 : 0;

      for (
        let j = startMonth;
        j <= endMonth;
        j = j > 12 ? j % 12 || 11 : j + 1
      ) {
        let month = j + 1;
        let displayMonth: any = month < 10 ? "0" + month : month;
        dates.push(new Date(i, displayMonth, 1));
      }
    }
    return dates;
  }

  return {
    handleDate,
    getDatesBetweenDates,
    handleTime,
    capitalize,
    moveArrayItemToNewIndex,
    getImageUrl,
    handleHms,
    removeItemFromArray,
    dateRange,
    handleDateIso,
    secondsToHms,
  };
}
