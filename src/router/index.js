import { createRouter, createWebHistory } from "vue-router";
import CanvasView from "@/views/CanvasView.vue";
import SolarSystemView from "@/views/SolarSystemView.vue";
// import HomeView from "../views/HomeView.vue";

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
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
});

export default router;
