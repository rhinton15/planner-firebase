// https://learnvue.co/tutorials/vue-firebase-authentication

import { createRouter, createWebHistory } from "vue-router";
// const fb = require("./../../firebaseConfig.js");
import { getAuth } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../pages/Home.vue"),
    },
    {
      path: "/profile",
      component: () => import("../pages/Profile.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      component: () => import("../pages/LogIn.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/planner",
      component: () => import("../pages/Planner.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/managePatterns",
      component: () => import("../pages/ManagePatterns.vue"),
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const currentUser = getAuth().currentUser;
  console.log(requiresAuth);
  if (requiresAuth && !currentUser)
    next({ path: "/login", query: { redirect: to.fullPath } });
  else if (requiresAuth === false && currentUser) next("/planner");
  else next();
});

export default router;
