import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../views/LandGeoLocation.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: MainLayout,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
