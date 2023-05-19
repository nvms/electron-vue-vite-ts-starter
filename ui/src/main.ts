import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.scss";
import App from "./App.vue";
import packages from "../packages";
import { thing } from "~/thing";

console.log(`from common package: ${thing}`);

const pinia = createPinia();

createApp(App)
  .use(packages)
  .use(pinia)
  .mount("#app")
  .$nextTick(() => {
    // setTimeout(() => {
      postMessage({ payload: "removeLoading" }, "*");
    // }, 250);
  });
