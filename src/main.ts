import { createApp } from "vue";
import App from "@/App.vue";
import i18n from "@/app/config/i18n";
import { router } from "@/app/config/router/router";
import { createPinia } from "pinia";
import "@/services/axios";
import ApiService from "@/services/api.service";
import axios from "axios";
import Notifications from "@kyvg/vue3-notification";
// @ts-ignore
import velocity from "velocity-animate";
import "./assets/index.css";

const app = createApp(App);

const pinia = createPinia();

ApiService.mount401Interceptor();
app.use(Notifications);

axios.defaults.headers.common["lang"] = (
  localStorage.getItem("lang") || "uz_cyrl"
).replace("_", "-");

app.use(i18n);
app.use(router);
app.use(pinia);
app.mount("#app");
