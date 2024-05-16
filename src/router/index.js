import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/three-view",
      name: "three-view",
      component: () => import("@/views/CanvasView.vue"),
    },
    {
      path: "/solarsystem",
      name: "solarsystem",
      component: () => import("@/views/SolarSystemView.vue"),
    },
  ],
});

export default router;
