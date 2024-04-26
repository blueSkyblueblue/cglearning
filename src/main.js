import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";

const app = createApp(App);
app.use(router);

const eventBus = mitt();
app.provide("eventBus", eventBus);

app.mount("#app");
