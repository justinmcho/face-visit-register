import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/info",
    name: "Info",
    component: () => import("../views/Info.vue"),
  },
  {
    path: "/capture",
    name: "Capture",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Capture.vue"),
  },
  {
    path: "/confirmation",
    name: "Confirmation",
    component: () => import("../views/Confirmation.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
