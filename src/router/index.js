import { createRouter, createWebHistory } from "vue-router";
import { defineAsyncComponent } from "vue";

// import CanvasView from "@/views/CanvasView.vue";
// import SolarSystemView from "@/views/SolarSystemView.vue";
// import HomeView from "../views/HomeView.vue";

const CanvasView = defineAsyncComponent(() => import("@/views/CanvasView.vue"));
const SolarSystemView = defineAsyncComponent(() => import("@/views/SolarSystemView.vue"));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: CanvasView,
    },
    {
      path: "/solarsystem",
      name: "solarsystem",
      component: SolarSystemView,
    },
  ],
});

export default router;
