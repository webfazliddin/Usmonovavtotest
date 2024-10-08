import {
  DefaultLessonDataDto,
  IChildTopics,
  IMyProgram,
  IMyTestResult,
  ITopicsDTO,
} from "@/models";
import { AxiosError } from "axios";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global-store", {
  state: () => ({
    programs: [] as IMyProgram[],
    allPrograms: [] as IMyProgram[],
    programsLoading: false as boolean,
    allProgramsLoading: false as boolean,
    activeProgram: null as IMyProgram | null,
    theme:
      typeof localStorage !== "undefined"
        ? localStorage.getItem("theme") || "primary"
        : "primary",
    actives: {
      topicIndex: null as number | null,
      childTopicIndex: null as number | null,
      lesson: null as DefaultLessonDataDto | null,
    },
    results: [] as IMyTestResult[],
    resultsLoading: false as boolean,
  }),
  getters: {
    getPrograms(): IMyProgram[] {
      return this.programs;
    },
    getAllPrograms(): IMyProgram[] {
      return this.allPrograms;
    },
    getActiveProgram(): IMyProgram | null {
      return this.activeProgram;
    },
    GetMyTestResults(): IMyTestResult[] {
      return this.results;
    },
  },
  actions: {
    handleTheme(value: "primary" | "green" | "dark") {
      this.theme = value;
      typeof localStorage !== "undefined" &&
        localStorage.setItem("theme", this.theme);
    },
  },
});
