import { buildApp } from "./app";

const { app, pinia } = buildApp();
app.mount("#app");
// @ts-ignore
const storeInitialState = window.INITIAL_DATA;
if (storeInitialState) {
  pinia.state.value = storeInitialState;
}
