# Frontend — KOD ARXITEKTURASI (Lidlar moduli) · Vue 3 versiyasi

> Bu fayl `Usmonovavtotest` loyihasining **haqiqiy stack'i** uchun qayta yozildi.
> Asl 05 React + TanStack Query + Zustand + Tailwind uchun edi — loyihada Vue 3 +
> Vuetify 3 + Pinia ishlatiladi, shuning uchun kod namunalari to'liq almashtirildi.
>
> **O'zgarmaydi:** `03_frontend_prompt.md` (API xaritasi) va `04_frontend_design.md`
> (dizayn tokenlari) stack'dan mustaqil — ular aynan kuchda qoladi.
> 10-bo'limda 04 dagi tokenlarni Vuetify theme'ga qanday ulash ko'rsatilgan.

---

## 0. Loyihaning hozirgi holati

| Nima | Holat |
|---|---|
| Framework | Vue 3.4 (`<script setup lang="ts">`), Vite 5 |
| UI kutubxona | Vuetify 3.6 + SCSS (`src/app/styles/`) |
| Holat | Pinia 2 (option store'lar) |
| Router | vue-router 4, `MainRoutes.ts` + har modulning `Routes.ts` fayli |
| HTTP | `axios` + `src/services/api.service.ts` (global `axios` defaults) |
| i18n | vue-i18n, `src/app/config/i18n/locales/*.json`, default `uz-latn` |
| Ikonka | `vue-tabler-icons` (asosiy) + `lucide-vue-next` (mavjud) |
| Bildirishnoma | `@kyvg/vue3-notification` + `setError()` helper |
| Telefon | `maska` + `components/form/FormPhoneNumber.vue` |
| Lidlar/CRM moduli | **Yo'q.** Noldan yoziladi |

Lidlar moduli shu repo ichiga yangi modul sifatida qo'shiladi.

---

## 1. Stack

### 1.1. Loyihada allaqachon bor — o'zgartirilmaydi

Pinia, vue-router, axios + `ApiService`, Vuetify, vue-i18n, `vue-tabler-icons`,
`maska`, `@kyvg/vue3-notification`. Yangi modul shularning ustiga quriladi.

### 1.2. Qo'shiladigan paketlar — atigi ikkita

```bash
npm i vue-draggable-plus dayjs
```

| Paket | Nega |
|---|---|
| `vue-draggable-plus` | Kanban drag & drop. Vue 3 + TS uchun yozilgan, SortableJS ustida. `vuedraggable@4` ham ishlaydi, lekin uzoq vaqt yangilanmagan |
| `dayjs` | `dd.MM.yyyy` formati, `daysInStage` hisoblari. 2 KB |

### 1.3. Qo'shilmaydigan narsalar va sabablari

| Asl 05 dagi | Nega bu yerda yo'q | O'rniga |
|---|---|---|
| TanStack Query | Loyihada butun server holati Pinia'da. Kanban'da draggable `v-model` mahalliy massivni talab qiladi — query keshi bilan ikkinchi nusxa saqlash muammosi tug'iladi | Pinia store, optimistik `moveLead` (7-bo'lim). Vue-query varianti kerak bo'lsa — 14-bo'lim |
| Zustand | Pinia bor | Pinia |
| Tailwind | Butun loyiha SCSS + Vuetify. Tailwind qo'shish ikki xil uslub tizimini yaratadi | 04 dagi tokenlar CSS o'zgaruvchisi sifatida (10-bo'lim) |
| `@dnd-kit` | React kutubxonasi, Vue porti yo'q | `vue-draggable-plus` |
| react-hook-form + zod | — | Vuetify `VForm` + `rules`, `components/form/*` |
| lucide-react | — | `vue-tabler-icons` (loyiha standarti) |

---

## 2. Papka tuzilishi

Loyihada ikki xil konvensiya bor va ikkalasiga ham amal qilamiz:

- **Servislar** — `src/services/services/X.service.ts` (barchasi bitta joyda)
- **Sahifa moduli** — `src/views/X/{index.vue, Routes.ts, types.ts, store/}`

```
src/services/services/
├── Leads.service.ts          # CRUD, move, arxiv, Excel
├── LeadsBoard.service.ts     # /leads/board
├── LeadsRefs.service.ts      # stages, sections, sources, tags, courses, reasons
├── LeadsTasks.service.ts     # eslatmalar
├── LeadsSms.service.ts       # SMS
└── Branches.service.ts       # filiallar (X-Branch-Id dan oldin chaqiriladi)

src/views/Leads/
├── Routes.ts                 # LeadsRoutes → MainRoutes.ts ga qo'shiladi
├── index.vue                 # doska sahifasi
├── types.ts                  # backend DTO'lari (4-bo'lim)
├── enums.ts                  # LeadTaskState, GenderType, ...
├── utils.ts                  # formatPhone, smsParts, taskStateColor
├── store/
│   ├── useBranch.ts          # tanlangan filial (localStorage'da saqlanadi)
│   ├── useLeadFilters.ts     # filtrlar + ochiq panel (UI holati)
│   ├── useLeadsBoard.ts      # doska ma'lumoti, move, cheksiz scroll
│   ├── useLeadRefs.ts        # ma'lumotnomalar keshi (stages, tags, sources...)
│   └── boardUtils.ts         # moveLeadInBoard — sof funksiya, test bilan
└── components/
    ├── Board/
    │   ├── LeadsBoard.vue
    │   ├── StageColumn.vue
    │   ├── SectionGroup.vue
    │   ├── LeadCard.vue
    │   └── QuickCreateForm.vue
    ├── LeadDrawer/
    │   ├── LeadDrawer.vue
    │   ├── DetailsTab.vue
    │   ├── HistoryTab.vue
    │   └── MoveTab.vue
    ├── Filters/
    │   ├── FilterBar.vue
    │   └── FiltersPopover.vue
    ├── Sms/
    ├── Tasks/
    └── Settings/             # ustun, bo'lim, teg, manba, sabab sozlamalari

src/composables/
└── useDebounce.ts            # YANGI — qidiruvda har harfda so'rov ketmasin

src/app/styles/pages/
└── _leads.scss               # YANGI — 04 dagi tokenlar (10-bo'lim)
```

⚠️ `src/features/` papkasi loyihada **sahifa emas, katta komponent guruhlari** uchun
ishlatiladi (`features/Test`, `features/Exam`). Lidlar — routed sahifa, shuning uchun
`src/views/Leads/`. Asl 05 dagi `src/features/leads/` yo'lini ishlatmang, konvensiya buziladi.

---

## 3. API qatlami — eng muhim bo'lim

Loyihaning hozirgi `ApiService` da Lidlar moduli uchun **to'rtta yetishmovchilik** bor.
Ularni tuzatmasdan modulni yozib bo'lmaydi. Har biri aniq diff bilan.

### 3.1. `X-Branch-Id` — request interceptor

Hozir loyihada **request interceptor umuman yo'q**, token `axios.defaults.headers.common`
orqali bir marta o'rnatiladi (`ApiService.setHeader()`). Filial sarlavhasini har bir
servis metodida qo'lda yozish — xatoning eng katta manbai: bitta joyda unutilsa,
**boshqa filialning ma'lumoti ko'rinadi**.

`src/services/api.service.ts` da `ApiService` obyektiga qo'shing:

```ts
_branchInterceptor: 0,

mountBranchInterceptor() {
  this._branchInterceptor = axios.interceptors.request.use((config) => {
    const url = config.url ?? "";

    // Faqat CRM endpointlari filialni talab qiladi.
    // Istisno: crm/branches (filial tanlashdan OLDIN chaqiriladi) va crm/public/*
    const needsBranch =
      url.includes("crm/") &&
      !url.includes("crm/branches") &&
      !url.includes("crm/public/");

    if (needsBranch) {
      // Store'ni import QILMANG — dumaloq bog'liqlik chiqadi.
      // useBranch store filial id ni shu kalitga yozadi.
      const branchId = localStorage.getItem("crm-branch");
      if (branchId) config.headers["X-Branch-Id"] = branchId;
    }
    return config;
  });
},

unmountBranchInterceptor() {
  axios.interceptors.request.eject(this._branchInterceptor);
},
```

`src/app.ts` da mount qiling — `mount401Interceptor()` yonida:

```ts
ApiService.mount401Interceptor();
ApiService.mountBranchInterceptor();   // ← YANGI
```

⚠️ **LMS endpointlariga tegmaydi.** Shart faqat `crm/` bo'lgan URL'larga ishlaydi;
`Courses`, `Categories`, `Exams` kabi mavjud so'rovlar o'zgarishsiz qoladi.

### 3.2. Massivli query parametrlari

Filtrlarda `tagIds`, `leadSourceIds`, `employeeIds` massivlari bor. Backend
`?tagIds=1&tagIds=5` kutadi; axios standart holatda `tagIds[]=1&tagIds[]=5` yuboradi.

Loyihadagi mavjud servislar query'ni qo'lda string qilib yig'adi
(`Courses?Page=${page}&Size=${size}`) — Lidlar filtrida bu usul ishlamaydi,
chunki parametrlar shartli va massivli.

`src/app.ts` da bir marta global qilib qo'ying (`ApiService` global `axios` bilan ishlaydi):

```ts
axios.defaults.paramsSerializer = (params: Record<string, any>) => {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      // repeat rejimi: tagIds=1&tagIds=5
      value.forEach((v) => v !== null && v !== undefined && sp.append(key, String(v)));
    } else {
      sp.append(key, String(value));
    }
  }
  return sp.toString();
};
```

`qs` paketini qo'shmaslik uchun qo'lda yozilgan. Mavjud servislarga ta'sir qilmaydi —
ular `config.params` ishlatmaydi, query'ni URL string'iga yozadi.

### 3.3. `DELETE` so'rovida body

Backend lidni o'chirishda sababni **body'da** kutadi:
`DELETE /leads/{id}` + `{ leadDeleteReasonId }`.

Hozirgi `ApiService.delete(resource)` config qabul qilmaydi:

```ts
// HOZIR — sababni yuborib bo'lmaydi
delete(resource: string) {
  return axios.delete(resource);
},

// KERAK
delete(resource: string, config?: AxiosRequestConfig) {
  return axios.delete(resource, config);
},
```

Chaqirish:

```ts
ApiService.delete(`crm/leads/${id}`, { data: { leadDeleteReasonId: reasonId } });
```

`put` ga ham `config?: AxiosRequestConfig` qo'shing — hozir u ham qabul qilmaydi.

⚠️ Bu o'zgarish **mavjud kodni buzmaydi** — ikkala parametr ham ixtiyoriy,
`components/Actions/DeleteAction.vue` avvalgidek ishlayveradi.

### 3.4. Base URL — hard-code'dan chiqarish

```ts
// src/composables/useAppUrl.ts — HOZIR
const API_URL = ref<string>("https://api.usmonov-avtomaktab.uz/api");
```

`.env` da `VITE_API_URL="/"` bor, lekin ishlatilmaydi. CRM backend boshqa manzilda
bo'lsa (yoki test/prod ajratilsa) — bu joy tuzatilishi kerak:

```ts
export const useAppUrl = () => {
  const API_URL = ref<string>(
    import.meta.env.VITE_API_URL || "https://api.usmonov-avtomaktab.uz/api"
  );
  return { API_URL };
};
```

**Backend jamoasidan so'rang:** CRM endpointlari shu domendami yoki alohida?
Alohida bo'lsa — `ApiService` global `axios` defaults'ga tayangani uchun,
CRM uchun alohida `axios.create()` instance kerak bo'ladi va `ApiService` ni
o'sha instance bilan ishlatadigan qilib bo'lish kerak.

### 3.5. Servis namunasi

Loyiha konvensiyasi (`Courses.service.ts` uslubi) saqlanadi:

```ts
// src/services/services/Leads.service.ts
import ApiService from "../api.service";
import type { LeadFilterParams } from "@/views/Leads/types";

export const LeadsService = {
  GetList(params: LeadFilterParams) {
    return ApiService.get("crm/leads", { params });
  },
  GetById(id: number | string) {
    return ApiService.get(`crm/leads/${id}`);
  },
  Create(data: object) {
    return ApiService.post("crm/leads", data);
  },
  Update(id: number, data: object) {
    return ApiService.put(`crm/leads/${id}`, data);
  },
  Move(id: number, data: { leadSectionId: number; position: number }) {
    return ApiService.put(`crm/leads/${id}/move`, data);
  },
  Delete(id: number, leadDeleteReasonId: number) {
    return ApiService.delete(`crm/leads/${id}`, { data: { leadDeleteReasonId } });
  },
  Archive(id: number) {
    return ApiService.post(`crm/leads/${id}/archive`);
  },
  ExportExcel(params: LeadFilterParams) {
    return ApiService.print("crm/leads/export", { params });   // responseType: blob
  },
};
```

Excel yuklab olish uchun `useGlobal().forceFileDownload(res, "lidlar", ".xlsx")` —
loyihada tayyor helper bor, yangisini yozmang.

---

## 4. TypeScript tiplari

Backend DTO'laridan aynan ko'chirilgan — **bu qism asl 05 bilan bir xil**, chunki
tiplar framework'ga bog'liq emas. `src/views/Leads/types.ts` va `enums.ts` ga qo'ying.

⚠️ Nom konvensiyasi: `src/models/basic.ts` da `I` prefiksi ishlatiladi (`IFilter`),
`src/views/Categories/types.ts` da esa yo'q (`CategoryModel`). Lidlarda **prefikssiz,
backend DTO nomlari bilan bir xil** yozing — backend bilan taqqoslash osonlashadi.

```ts
// src/views/Leads/enums.ts
// Backend SON qaytaradi, matn emas
export enum LeadTaskState {
  None = 0,      // "Yo'q"
  Upcoming = 1,  // "Bor"
  Overdue = 2,   // "44kun"
}

export enum GenderType { Male = 1, Female = 2 }

export enum LeadContactType {
  Phone = 1, ParentPhone = 2, Telegram = 3, Instagram = 4, Email = 5,
  Facebook = 6, Address = 7, Passport = 8, Note = 9,
}

export enum LeadHistoryActionType {
  Created = 1, Updated = 2, Moved = 3, CommentAdded = 4, TaskCreated = 5,
  TaskCompleted = 6, SmsSent = 7, CallLogged = 8, Archived = 9,
  Restored = 10, Deleted = 11, ConvertedToStudent = 12,
  EmployeeChanged = 13, TagsChanged = 14,
}

export enum SmsStatus { Pending = 1, Sent = 2, Delivered = 3, Failed = 4 }
```

```ts
// src/views/Leads/types.ts
import type { LeadTaskState, GenderType, LeadContactType } from "./enums";

export interface PagedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface SelectItem { id: number; name: string }

// ---------- Doska ----------
export interface LeadBoard {
  stages: LeadBoardStage[];
  totalFilteredCount: number;
}

export interface LeadBoardStage {
  id: number;
  name: string;
  position: number;
  colorHex: string | null;
  isDefault: boolean;
  isSuccess: boolean;
  filteredCount: number;   // sarlavhadagi (7 / …
  totalCount: number;      // … / 7)
  sections: LeadBoardSection[];
}

export interface LeadBoardSection {
  id: number;
  leadStageId: number;
  name: string;
  position: number;
  isLocked: boolean;
  filteredCount: number;
  totalCount: number;
  leads: LeadCard[];       // faqat birinchi sahifa (20 ta)
}

// ---------- Karta ----------
export interface LeadTagShort {
  id: number;
  name: string;
  colorHex: string | null;
}

export interface LeadCard {
  id: number;
  fullName: string;
  phoneNumber: string;          // "998990905634" — formatlanmagan
  leadStageId: number;
  leadSectionId: number;
  position: number;
  createdAt: string;
  lastActivityAt: string;
  enteredStageAt: string;
  daysInStage: number;
  employeeId: number | null;
  employeeName: string | null;
  employeeInitials: string;     // "MR" yoki "A"
  taskState: LeadTaskState;
  taskStateText: string;        // "Yo'q" | "Bor" | "44kun" — TAYYOR MATN
  overdueDays: number | null;
  nextTaskDeadLine: string | null;
  leadSourceId: number | null;
  leadSourceName: string | null;
  courseId: number | null;
  courseName: string | null;
  tags: LeadTagShort[];
  commentCount: number;
  isArchived: boolean;
}

// ---------- Lid kartasi (o'ng panel) ----------
export interface LeadContact {
  id: number;
  contactType: LeadContactType;
  value: string;
  note: string | null;
}

export interface Lead {
  id: number;
  fullName: string;
  phoneNumber: string;
  birthDate: string | null;
  gender: GenderType | null;
  leadStageId: number;   leadStageName: string | null;
  leadSectionId: number; leadSectionName: string | null;
  position: number;
  leadSourceId: number | null; leadSourceName: string | null;
  courseId: number | null;     courseName: string | null;
  employeeId: number | null;   employeeName: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
  enteredStageAt: string;
  lastActivityAt: string;
  daysInStage: number;
  isArchived: boolean;
  archivedAt: string | null;
  convertedStudentId: number | null;
  convertedAt: string | null;
  tags: LeadTagShort[];
  contacts: LeadContact[];
  taskState: LeadTaskState;
  taskStateText: string;
  overdueDays: number | null;
  nextTaskDeadLine: string | null;
  commentCount: number;
  taskCount: number;
  callCount: number;
  smsCount: number;
}

// ---------- Filtr ----------
export interface LeadFilterParams {
  search?: string;
  leadSectionIds?: number[];
  leadStageId?: number;
  courseIds?: number[];
  tagIds?: number[];
  leadSourceIds?: number[];
  employeeIds?: number[];
  taskState?: LeadTaskState;
  dateFrom?: string;
  dateTo?: string;
  isArchived?: boolean;
  page?: number;
  size?: number;
}
```

---

## 5. Holat boshqaruvi — Pinia

To'rtta store, har biri bitta mas'uliyat bilan. Loyiha konvensiyasi bo'yicha
**option store** (`defineStore("nom", { state, getters, actions })`).

### 5.1. Filial

```ts
// src/views/Leads/store/useBranch.ts
import { defineStore } from "pinia";
import { BranchesService } from "@/services/services/Branches.service";
import { setError } from "@/utils/helpers";
import type { SelectItem } from "../types";

export const useBranch = defineStore("crmBranch", {
  state: () => ({
    branches: [] as SelectItem[],
    // ⚠️ Interceptor shu kalitni o'qiydi — nomi aynan "crm-branch" bo'lsin
    branchId: (Number(localStorage.getItem("crm-branch")) || null) as number | null,
    loading: false,
  }),
  actions: {
    async fetchBranches() {
      this.loading = true;
      try {
        const res = await BranchesService.SelectList();
        this.branches = res.data;
        if (!this.branchId && this.branches.length) {
          this.setBranch(this.branches[0].id);
        }
      } catch (e: any) {
        setError(e);
      } finally {
        this.loading = false;
      }
    },
    // Faqat holatni yozadi. Keshni tozalash — index.vue dagi watch'da (6-bo'lim),
    // shunda store'lar o'rtasida dumaloq import bo'lmaydi.
    setBranch(id: number) {
      if (this.branchId === id) return;
      this.branchId = id;
      localStorage.setItem("crm-branch", String(id));
    },
  },
});
```

### 5.2. Filtrlar va UI holati

```ts
// src/views/Leads/store/useLeadFilters.ts
import { defineStore } from "pinia";
import type { LeadFilterParams } from "../types";

export const useLeadFilters = defineStore("leadFilters", {
  state: () => ({
    filters: {} as LeadFilterParams,
    openLeadId: null as number | null,
    smsPanelOpen: false,
  }),
  getters: {
    // "Filtrlar" tugmasidagi nishoncha uchun (04 · 5.3)
    activeCount(): number {
      return Object.values(this.filters).filter(
        (v) => v !== undefined && v !== null && v !== "" &&
               (!Array.isArray(v) || v.length > 0)
      ).length;
    },
  },
  actions: {
    setFilters(patch: Partial<LeadFilterParams>) {
      this.filters = { ...this.filters, ...patch };
    },
    resetFilters() {
      this.filters = {};
    },
    openLead(id: number | null) {
      this.openLeadId = id;
    },
  },
});
```

### 5.3. Ma'lumotnomalar keshi

`stages`, `sections`, `sources`, `tags`, `courses`, `reasons`, `employees` — filtr
va formalarda qayta-qayta kerak bo'ladi. Har ochilganda so'rov yubormang.

```ts
// src/views/Leads/store/useLeadRefs.ts
export const useLeadRefs = defineStore("leadRefs", {
  state: () => ({
    sources: [] as SelectItem[],
    tags: [] as LeadTagShort[],
    courses: [] as SelectItem[],
    employees: [] as SelectItem[],
    deleteReasons: [] as SelectItem[],
    loaded: false,
  }),
  actions: {
    async fetchAll(force = false) {
      if (this.loaded && !force) return;
      try {
        const [sources, tags, courses, employees, reasons] = await Promise.all([
          LeadsRefsService.Sources(),
          LeadsRefsService.Tags(),
          LeadsRefsService.Courses(),
          LeadsRefsService.Employees(),
          LeadsRefsService.DeleteReasons(),
        ]);
        this.sources = sources.data;
        this.tags = tags.data;
        this.courses = courses.data;
        this.employees = employees.data;
        this.deleteReasons = reasons.data;
        this.loaded = true;
      } catch (e: any) {
        setError(e);
      }
    },
  },
});
```

⚠️ `useCategories` da `if (this.categories.length) return;` bor — u **hech qachon
qayta yuklamaydi**. Lidlarda `force` parametrini qoldiring: yangi teg yoki manba
yaratilgach `fetchAll(true)` chaqiriladi, aks holda ro'yxatda ko'rinmaydi.

---

## 6. Doskani yuklash

```ts
// src/views/Leads/store/useLeadsBoard.ts
import { defineStore } from "pinia";
import { LeadsBoardService } from "@/services/services/LeadsBoard.service";
import { setError } from "@/utils/helpers";
import { useLeadFilters } from "./useLeadFilters";
import { useBranch } from "./useBranch";
import type { LeadBoard } from "../types";

export const useLeadsBoard = defineStore("leadsBoard", {
  state: () => ({
    board: null as LeadBoard | null,
    loading: false,
    error: null as string | null,
    movingIds: [] as number[],             // ko'chirilayotgan kartalar
    sectionPages: {} as Record<number, { page: number; totalPages: number; loading: boolean }>,
  }),
  actions: {
    async fetchBoard() {
      const branchId = useBranch().branchId;
      if (!branchId) return;               // filial tanlanmaguncha so'rov yo'q

      this.loading = true;
      this.error = null;
      try {
        const { filters } = useLeadFilters();
        const res = await LeadsBoardService.Get({ ...filters, cardsPerSection: 20 });
        this.board = res.data;             // ⚠️ loading paytida board'ni null QILMANG
        this.sectionPages = {};
      } catch (e: any) {
        this.error = e?.response?.data?.message ?? "Doskani yuklab bo'lmadi";
        setError(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
```

Filtrlar o'zgarganda debounce bilan qayta yuklang:

```ts
// src/composables/useDebounce.ts — YANGI fayl
import { ref, watch, type Ref } from "vue";

export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout>;
  watch(source, (v) => {
    clearTimeout(timer);
    timer = setTimeout(() => (debounced.value = v), delay);
  }, { deep: true });
  return debounced;
}
```

```ts
// src/views/Leads/index.vue
const branchStore  = useBranch();
const filtersStore = useLeadFilters();
const refsStore    = useLeadRefs();
const boardStore   = useLeadsBoard();

const { filters } = storeToRefs(filtersStore);
const debouncedFilters = useDebounce(filters, 300);

watch(debouncedFilters, () => boardStore.fetchBoard(), { deep: true });

// Filial almashdi — butun CRM keshi eskirdi
watch(() => branchStore.branchId, () => {
  boardStore.$reset();
  refsStore.$reset();
  refsStore.fetchAll();
  boardStore.fetchBoard();
});

onMounted(async () => {
  await branchStore.fetchBranches();   // filial birinchi — X-Branch-Id shundan
  await refsStore.fetchAll();
  boardStore.fetchBoard();
});
```

> Loyihada `useThrottle` composable bor, lekin u `Ref` bilan ishlamaydi (callback
> qabul qiladi). Yuqoridagi `useDebounce` ni alohida fayl qilib qo'shing,
> mavjudini o'zgartirmang — boshqa sahifalar unga tayanadi.

**Filtr o'zgarganda doska "o'chib" ketmasin:** skeleton faqat birinchi yuklashda
(`!board && loading`), keyingilarida doska ustiga `opacity: .6` qo'ying —
04 · 7-bo'limdagi talab shu bilan bajariladi.

---

## 7. Drag & drop — optimistik ko'chirish

Eng nozik qism. Ikki qoida o'zgarmaydi:

1. Karta **darhol** ko'chsin, so'rov javobini kutmasin
2. Server xato qaytarsa (masalan bo'lim qulflangan) — **eski holatga qaytsin**

### 7.1. Sof funksiya — `moveLeadInBoard`

Alohida faylga yozing va test bilan qoplang (`store/boardUtils.ts`):

```ts
export function moveLeadInBoard(
  board: LeadBoard,
  leadId: number,
  toSectionId: number,
  toPosition: number
): LeadBoard {
  const next: LeadBoard = structuredClone(board);
  const sections = next.stages.flatMap((s) => s.sections);

  const from = sections.find((s) => s.leads.some((l) => l.id === leadId));
  const to = sections.find((s) => s.id === toSectionId);
  if (!from || !to) return board;

  const idx = from.leads.findIndex((l) => l.id === leadId);
  const [lead] = from.leads.splice(idx, 1);

  lead.leadSectionId = to.id;
  lead.leadStageId = to.leadStageId;
  lead.position = toPosition;
  to.leads.splice(toPosition, 0, lead);

  if (from.id !== to.id) {
    // ⚠️ IKKALA bo'limning ham sanog'ini yangilang, aks holda raqamlar
    // bir zumga noto'g'ri ko'rinadi
    from.filteredCount--; from.totalCount--;
    to.filteredCount++;   to.totalCount++;

    const fromStage = next.stages.find((s) => s.id === from.leadStageId);
    const toStage   = next.stages.find((s) => s.id === to.leadStageId);
    if (fromStage && toStage && fromStage.id !== toStage.id) {
      fromStage.filteredCount--; fromStage.totalCount--;
      toStage.filteredCount++;   toStage.totalCount++;
    }
  }
  return next;
}
```

### 7.2. Store'dagi `moveLead`

```ts
// useLeadsBoard.ts → actions
async moveLead(leadId: number, toSectionId: number, toPosition: number) {
  if (!this.board) return;

  const snapshot = structuredClone(this.board);      // orqaga qaytarish uchun
  this.board = moveLeadInBoard(this.board, leadId, toSectionId, toPosition);
  this.movingIds.push(leadId);

  try {
    await LeadsService.Move(leadId, { leadSectionId: toSectionId, position: toPosition });
  } catch (e: any) {
    this.board = snapshot;                           // xato — eski holatga
    setError(e);                                     // qizil toast, backend matni
  } finally {
    this.movingIds = this.movingIds.filter((id) => id !== leadId);
    this.fetchBoard();                               // sanoqlarni serverdan aniqlaymiz
  }
}
```

### 7.3. `vue-draggable-plus` bilan ulash

```vue
<!-- components/Board/SectionGroup.vue -->
<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import { LockIcon } from "vue-tabler-icons";
import LeadCard from "./LeadCard.vue";
import { useLeadsBoard } from "../../store/useLeadsBoard";
import type { LeadBoardSection } from "../../types";

const props = defineProps<{ section: LeadBoardSection }>();
const boardStore = useLeadsBoard();

const onEnd = (evt: any) => {
  if (evt.from === evt.to && evt.oldIndex === evt.newIndex) return;
  const leadId = Number(evt.item.dataset.leadId);
  const toSectionId = Number(evt.to.dataset.sectionId);
  boardStore.moveLead(leadId, toSectionId, evt.newIndex);
};
</script>

<template>
  <div class="lead-section" :class="{ 'is-locked': section.isLocked }">
    <div class="lead-section__head">
      <span>{{ section.name }}</span>
      <LockIcon v-if="section.isLocked" :size="14" class="locked-icon" />
    </div>

    <VueDraggable
      v-model="section.leads"
      :data-section-id="section.id"
      :group="{
        name: 'leads',
        pull: true,
        // ⚠️ Qulflangan bo'limga tashlashni SHU YERDA bloklang.
        // Aks holda foydalanuvchi tashlaydi, keyin karta orqaga sakraydi.
        put: () => !section.isLocked,
      }"
      :animation="150"
      ghost-class="lead-card--ghost"
      drag-class="lead-card--dragging"
      class="lead-section__list"
      @end="onEnd"
    >
      <LeadCard
        v-for="lead in section.leads"
        :key="lead.id"
        :lead="lead"
        :data-lead-id="lead.id"
        :pending="boardStore.movingIds.includes(lead.id)"
      />
    </VueDraggable>

    <div class="lead-section__count">
      {{ section.filteredCount }} / {{ section.totalCount }}
    </div>
  </div>
</template>
```

`v-model="section.leads"` — SortableJS massivni **o'zi joyida o'zgartiradi**, ya'ni
kartaning ko'chishi optimistik bo'ladi. `moveLead` esa sanoqlarni to'g'rilaydi va
rollback uchun snapshot saqlaydi. Ikkisi bir-birini takrorlamaydi: SortableJS
massivni, store sanoqni boshqaradi.

CSS holatlari `04_frontend_design.md` 4.4 bo'limidan:

```scss
.lead-card--dragging { box-shadow: var(--shadow-drag); transform: rotate(1.5deg); opacity: .95; }
.lead-card--ghost    { background: var(--bg-muted); border: 2px dashed var(--border); opacity: .6; }
.lead-section.is-locked { opacity: .85; }
.lead-section.is-locked .lead-section__list { cursor: not-allowed; }
```

---

## 8. Bo'limni pastga scroll qilish

Doska har bo'limda 20 ta karta beradi. Qolganini alohida so'rov bilan oling.

```ts
// useLeadsBoard.ts → actions
async loadMoreSection(sectionId: number) {
  const meta = this.sectionPages[sectionId] ?? { page: 1, totalPages: 99, loading: false };
  if (meta.loading || meta.page >= meta.totalPages) return;

  meta.loading = true;
  this.sectionPages[sectionId] = meta;
  try {
    const { filters } = useLeadFilters();
    const res = await LeadsService.GetList({
      ...filters,
      leadSectionIds: [sectionId],
      page: meta.page + 1,       // 1-sahifa doskadan keldi
      size: 20,
    });
    const section = this.board?.stages
      .flatMap((s) => s.sections)
      .find((s) => s.id === sectionId);
    if (section) section.leads.push(...res.data.data);

    meta.page = res.data.page;
    meta.totalPages = res.data.totalPages;
  } catch (e: any) {
    setError(e);
  } finally {
    meta.loading = false;
  }
}
```

Bo'lim konteynerida `IntersectionObserver`:

```ts
// components/Board/SectionGroup.vue
const listEl = ref<HTMLElement | null>(null);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) boardStore.loadMoreSection(props.section.id); },
    { root: listEl.value, rootMargin: "100px" }
  );
  if (sentinel.value) observer.observe(sentinel.value);
});
onUnmounted(() => observer?.disconnect());
```

Sentinel ostida 04 · 7-bo'limdagi "3 nuqtali kichik indikator" ni
`v-if="sectionPages[section.id]?.loading"` bilan ko'rsating.

---

## 9. Yordamchi funksiyalar

`src/views/Leads/utils.ts` (yoki `src/utils/formatter.ts` ga qo'shing — loyihada
allaqachon shunday fayl bor).

```ts
/** "998990905634" -> "+998 99 090 56 34" */
export function formatPhone(raw: string): string {
  const d = (raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("998")) {
    return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
  }
  return raw;
}

/** SMS necha qismga bo'linadi — backenddagi SmsHelper bilan bir xil qoida */
export function smsParts(text: string): number {
  if (!text) return 1;
  const unicode = [...text].some((c) => c.charCodeAt(0) > 127);
  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  return text.length <= single ? 1 : Math.ceil(text.length / multi);
}

/** Karta belgisining rangi — 04 dagi tokenlarga bog'lanadi */
export function taskStateColor(state: LeadTaskState): string {
  return {
    [LeadTaskState.None]: "var(--state-none)",
    [LeadTaskState.Upcoming]: "var(--state-upcoming)",
    [LeadTaskState.Overdue]: "var(--state-overdue)",
  }[state];
}
```

⚠️ **Telefon kiritish** uchun yangi komponent yozmang — `components/form/FormPhoneNumber.vue`
va `composables/CheckPhoneNumber.ts` tayyor: `maska` bilan `998 ## ### ## ##` maskasi
qo'yilgan va `v-model` ga tozalangan raqam qaytaradi. Backend ham tozalangan raqam kutadi.

---

## 10. `04_frontend_design.md` tokenlarini ulash

Loyihada Vuetify theme'lari (`LightTheme.ts` / `DarkTheme.ts`) va SCSS bor,
Tailwind yo'q. 04 dagi CSS o'zgaruvchilari **to'g'ridan-to'g'ri** ishlatiladi —
faqat qorong'i rejim selektori Vuetify'ga moslanadi.

Vuetify ilova ildiziga `v-theme--BLUE_THEME` / `v-theme--DARK_BLUE_THEME` klassini
qo'yadi (`FullLayout.vue` da `<v-app :theme="theme.global.name.value">`).
Shundan foydalanamiz:

```scss
// src/app/styles/pages/_leads.scss — YANGI fayl
:root {
  /* 04 · 2.1 — yorug' rejim, o'zgarishsiz ko'chiriladi */
  --font: 'Inter', 'Poppins', -apple-system, 'Segoe UI', Roboto, sans-serif;

  --bg-page: #F4F5F7;
  --bg-surface: #FFFFFF;
  --bg-muted: #F1F2F4;
  --bg-hover: #F7F8F9;
  --border: #E3E5E8;
  --border-strong: #D0D4D9;
  --text-primary: #1F2329;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  --text-inverse: #FFFFFF;
  --brand: #E98A3C;
  --brand-hover: #D97B2D;
  --brand-soft: #FDF1E7;
  --logo-yellow: #FFD400;
  --blue: #3B82F6;   --blue-soft: #EFF6FF;
  --green: #22A06B;  --green-soft: #E9F7F1;
  --amber: #F0AD4E;  --amber-soft: #FEF6E7;
  --red: #E5484D;    --red-soft: #FDECEC;
  --state-none: #F5B841;
  --state-upcoming: #9CA3AF;
  --state-overdue: #E5484D;

  --fs-xs: 11px; --fs-sm: 12px; --fs-base: 13px;
  --fs-md: 14px; --fs-lg: 16px; --fs-xl: 18px;

  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px;
  --sp-4: 16px; --sp-5: 20px; --sp-6: 24px;
  --r-sm: 4px; --r-md: 6px; --r-lg: 8px; --r-xl: 12px;

  --shadow-hover: 0 2px 6px rgba(16, 24, 40, .08);
  --shadow-drag:  0 8px 20px rgba(16, 24, 40, .14);
  --shadow-panel: 0 4px 24px rgba(16, 24, 40, .12);
}

/* 04 · 2.2 — qorong'i rejim. Vuetify'ning barcha DARK_* theme klasslari */
[class*="v-theme--DARK"] {
  --bg-page: #16181D;
  --bg-surface: #1E2126;
  --bg-muted: #24272E;
  --bg-hover: #262A31;
  --border: #2F333A;
  --border-strong: #3C4149;
  --text-primary: #E6E8EB;
  --text-secondary: #9BA1A9;
  --text-muted: #6E757E;
  --brand-soft: #2A2018;
  --blue-soft: #16233A;
  --green-soft: #13251E;
  --amber-soft: #2A2213;
  --red-soft: #2E1A1B;
  /* Harakat ranglari (--blue/--green/--red/--amber) qorong'i fonda ham
     o'qiladi — o'zgarmaydi. Faqat -soft variantlari almashadi */
}
```

`src/app/styles/style.scss` ga import qo'shing:

```scss
@import "./pages/dashboards";
@import "./pages/editor";
@import "./pages/leads";   // ← YANGI
```

### 10.1. Shrift o'lchami bilan ziddiyat

⚠️ Loyihaning asosiy shrifti **Poppins** (`_variables.scss` da `$body-font-family`),
`:root { font-size: 16px }` esa `style.scss` da. 04 asos o'lcham sifatida **13px**
va **Inter** ni belgilaydi (zich ishchi interfeys).

Butun loyihani o'zgartirmang. Faqat Lidlar sahifasini o'rab qo'ying:

```scss
.leads-module {
  font-family: var(--font);
  font-size: var(--fs-base);
  background: var(--bg-page);
  color: var(--text-primary);
}
```

`src/views/Leads/index.vue` ildiziga `class="leads-module"`.
04 · 9-bo'limning 1-savoli ("Shrift — Inter deb taxmin qilindi") shu yerda hal
bo'ladi: mijoz Poppins'da qolishni xohlasa, `--font` dan `'Inter'` ni oching, xolos.

### 10.2. Dark mode tugmasi hali ulanmagan

04 da yuqori panelda quyosh/oy tugmasi majburiy. Loyihada `DarkTheme.ts` fayllari
va `customizer` store'da `actTheme` bor, lekin **`VerticalHeader.vue` da almashtirish
tugmasi yo'q** va `SET_THEME` hech qayerdan chaqirilmaydi. Qo'shish kerak:

```ts
import { useTheme } from "vuetify";
import { useCustomizerStore } from "@/app/config/layouts/store/customizer";

const theme = useTheme();
const customizer = useCustomizerStore();

const toggleTheme = () => {
  const current = theme.global.name.value;
  const next = current.startsWith("DARK_")
    ? current.replace("DARK_", "")
    : `DARK_${current}`;
  theme.global.name.value = next;
  customizer.SET_THEME(next);
  localStorage.setItem("theme", next);   // qayta yuklashdan keyin saqlansin
};
```

Bu butun loyihaga foyda beradi, faqat Lidlarga emas.

---

## 11. Route, menyu va i18n ro'yxatga olish

### 11.1. Route

```ts
// src/views/Leads/Routes.ts
import { RouteRecordRaw } from "vue-router";

export const LeadsRoutes: RouteRecordRaw[] = [
  {
    path: "/crm/leads",
    name: "Leads",
    component: () => import("./index.vue"),
  },
];
```

```ts
// src/app/config/router/MainRoutes.ts
import { LeadsRoutes } from "@/views/Leads/Routes";
// children: [ ... , ...LeadsRoutes ]
```

⚠️ `router/index.ts` dagi `adminOnlyRoutes` massivi — Lidlar faqat adminlarga
ochiq bo'lsa, `"/crm/leads"` ni o'sha ro'yxatga qo'shing. Aks holda oddiy
foydalanuvchi ham kira oladi.

### 11.2. Menyu

```ts
// src/app/config/permissions/index.ts — admin bo'limiga
{
  title: "leads",
  to: "/crm/leads",
  icon: UsersGroupIcon,      // vue-tabler-icons
  visible: true,
},
```

### 11.3. i18n

Barcha matnlar `$t()` orqali. Kalitlarni **to'rtta faylga ham** qo'shing —
`uz-latn.json`, `uz-cyrl.json`, `ru.json`, `qr.json`. Bittasi unutilsa,
o'sha tilda kalit nomi ko'rinib qoladi (`leads.title` kabi).

⚠️ Backend xato xabarlari (`{ message: "..." }`) allaqachon o'zbekcha keladi —
ularni tarjima qilmang, `setError()` to'g'ridan-to'g'ri ko'rsatadi.

---

## 12. Diqqat qilinadigan joylar

Loyihaga xos tuzoqlar birinchi, umumiylar keyin.

| Nima | Nega muhim |
|---|---|
| `X-Branch-Id` faqat interceptor'da | Servis metodida qo'lda yozilsa — bitta joyda unutiladi va **boshqa filialning lidi ko'rinadi** |
| Interceptor `localStorage` dan o'qiydi | Store'ni import qilsa dumaloq bog'liqlik chiqadi. `useBranch` va interceptor bir xil kalitni ishlatsin: `crm-branch` |
| `ApiService.delete` ga config qo'shish | Hozir yo'q — lidni sabab bilan o'chirib bo'lmaydi (3.3) |
| `paramsSerializer` | Bo'lmasa `tagIds[]=1` ketadi, backend tushunmaydi (3.2) |
| Filial almashganda `$reset()` | Eski filialning doskasi yangi filialda ko'rinib qolmasin (6-bo'lim) |
| `useCategories` uslubidagi `if (length) return` | Ma'lumotnomalarda **ishlatmang** — teg qo'shilgach ro'yxat yangilanmay qoladi (5.3) |
| Vuetify global `defaults` | `VTextField` da `density: comfortable` — 04 dagi 34px balandlik uchun Lidlar formalarida `density="compact"` bering |
| `axios.defaults.headers.common["lang"]` | `app.ts` da o'rnatiladi, CRM so'rovlariga ham ketadi. Backend uni e'tiborsiz qoldirishini tasdiqlang |
| 401 → `/sign-in` | Mavjud interceptor shunday qiladi. CRM uchun ham to'g'ri, o'zgartirmang |
| `taskStateText` ni **o'zi hisoblamang** | Backend tayyor beradi. Front faqat rang tanlaydi |
| Telefonni **formatlamasdan yuboring** | Backend o'zi tozalaydi. `formatPhone` faqat ko'rsatish uchun |
| `tagIds` va `contacts` — **to'liq ro'yxat** | PUT'da qisman yuborilsa, yuborilmagani o'chib ketadi |
| Enum'lar **son** | `taskState === 2`, `"Overdue"` emas |
| Excel — `ApiService.print` | `responseType: blob` allaqachon ichida. `useGlobal().forceFileDownload` bilan saqlang |
| "Talaba yaratish" — **o'chirib qo'ying** | Backend hali qo'llab-quvvatlamaydi, aniq xato qaytaradi |
| SMS yuborish — **o'chirib qo'ymang** | Interfeysni to'liq yasang; provayder ulangach o'zi ishlaydi |
| `structuredClone` | Zamonaviy brauzerlarda bor. Eski brauzer kerak bo'lsa — `JSON.parse(JSON.stringify(x))` |

---

## 13. Ish tartibi

Har bir qadam oxirida ishlaydigan natija bo'lishi kerak.

| # | Qadam | Fayllar | Natija |
|---|---|---|---|
| 1 | API qatlami tuzatishlari | `api.service.ts`, `app.ts`, `useAppUrl.ts` | `X-Branch-Id` ketadi, massivli param'lar to'g'ri, DELETE body bilan |
| 2 | Route + menyu + bo'sh sahifa | `views/Leads/`, `MainRoutes.ts`, `permissions/index.ts` | `/crm/leads` ochiladi |
| 3 | Dizayn tokenlari | `styles/pages/_leads.scss`, `style.scss` | Ranglar va o'lchamlar joyida, dark mode ishlaydi |
| 4 | Filial tanlagichi | `useBranch.ts`, `Branches.service.ts`, topbar | Filial tanlanadi va saqlanadi |
| 5 | Doska: ustun, bo'lim, karta, sanoqlar | `useLeadsBoard.ts`, `Board/*` | Lidlar ko'rinadi |
| 6 | Tezkor yaratish formasi | `QuickCreateForm.vue` | Lid qo'shiladi va doskada paydo bo'ladi |
| 7 | Lid paneli — Tafsilotlar tabi | `LeadDrawer/*` | Karta ochiladi, tahrirlanadi |
| 8 | Filtrlar + "Filtrlar" popover | `Filters/*`, `useLeadFilters.ts` | Filtr ishlaydi, sanoqlar yangilanadi |
| 9 | Drag & drop + cheksiz scroll | `boardUtils.ts`, `SectionGroup.vue` | Karta ko'chadi, ro'yxat to'liq yuklanadi |
| 10 | Karta `⋯` menyusi: comment, qo'ng'iroq, o'chirish, arxiv | — | — |
| 11 | Tarix tabi, eslatmalar | `HistoryTab.vue`, `Tasks/*` | Karta belgisi o'zgaradi |
| 12 | SMS paneli, sozlamalar, Excel | `Sms/*`, `Settings/*` | — |
| 13 | Holatlar: bo'sh, yuklanmoqda, xato, skeleton | — | 04 · 7-bo'lim to'liq qoplanadi |

**5–7 qadamlardan keyin to'xtab, backend bilan birga tekshiring** — filtr va
drag&drop yozilgandan keyin xato topilsa, tuzatish qimmatroq bo'ladi.

---

## 14. Ilova: `@tanstack/vue-query` varianti

Agar jamoa server keshini qo'lda boshqarishni xohlamasa, `@tanstack/vue-query` v5
Vue uchun mavjud va asl 05 dagi naqsh deyarli bir xil ishlaydi:

```bash
npm i @tanstack/vue-query
```

```ts
// app.ts
import { VueQueryPlugin } from "@tanstack/vue-query";
app.use(VueQueryPlugin);
```

```ts
export function useBoard() {
  const branch = useBranch();
  const { filters } = storeToRefs(useLeadFilters());
  const debounced = useDebounce(filters, 300);

  return useQuery({
    // branchId kalitning BOSHIDA — filial almashganda butun kesh bekor bo'ladi
    queryKey: computed(() => ["crm", branch.branchId, "board", debounced.value]),
    queryFn: () => LeadsBoardService.Get({ ...debounced.value, cardsPerSection: 20 })
                     .then((r) => r.data),
    enabled: computed(() => !!branch.branchId),
    placeholderData: keepPreviousData,
  });
}
```

⚠️ **Bitta jiddiy nuqta.** `vue-draggable-plus` ning `v-model` i o'zgartiriladigan
massivni talab qiladi, query keshi esa faqat `setQueryData` orqali o'zgaradi.
Ikkalasini ulash uchun keshdan mahalliy `ref` ga nusxa olib `watch` bilan
sinxronlash kerak — va sudrash paytida sinxronlashni to'xtatib turish kerak,
aks holda karta qo'l ostida sakrab ketadi:

```ts
const local = ref<LeadBoard | null>(null);
const isDragging = ref(false);
watch(() => query.data.value, (v) => {
  if (!isDragging.value) local.value = v ? structuredClone(v) : null;
}, { immediate: true });
```

Shu qo'shimcha murakkablik sababli **asosiy tavsiya — 5–8 bo'limlardagi Pinia
varianti**: u loyihaning qolgan qismi bilan bir xil uslubda va draggable bilan
ziddiyatsiz ishlaydi.

---

## 15. Uchta hujjat qanday ishlaydi

| Fayl | Savolga javob beradi | Stack'ga bog'liqmi |
|---|---|---|
| `03_frontend_prompt.md` | Nima ulanadi — har bir tugma qaysi endpointga | Yo'q |
| `04_frontend_design.md` | Qanday ko'rinadi — rang, o'lcham, oraliq | Yo'q (10-bo'limda ulash ko'rsatilgan) |
| `05_frontend_code.md` (shu fayl) | Qanday yoziladi — Vue 3 + Pinia + Vuetify | Ha |

---

## 16. Ochiq savollar

`04` dagi 5 ta dizayn savolidan tashqari, kod tomonida:

1. **CRM backend manzili** — LMS bilan bir domendami
   (`api.usmonov-avtomaktab.uz/api`) yoki alohida? Alohida bo'lsa `ApiService` ni
   qayta ko'rib chiqish kerak (3.4)
2. **Endpoint prefiksi** — `crm/leads` mi yoki `api/crm/leads`? Interceptor sharti
   shunga qarab yoziladi (3.1). Mavjud servislar prefikssiz yozilgan (`Courses`)
3. **Lidlar kimga ochiq** — faqat adminlarga bo'lsa `adminOnlyRoutes` ga qo'shiladi (11.1)
4. **`lang` sarlavhasi** — CRM endpointlari uni e'tiborsiz qoldiradimi (12-jadval)
5. **Shrift** — Lidlar sahifasida Inter (13px) yoki loyiha bo'ylab Poppins (10.1)
