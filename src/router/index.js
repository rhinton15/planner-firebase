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
      meta: { requiresAdmin: true },
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
  const requiresAdmin = to.meta.requiresAdmin;
  const requiresAuth = to.meta.requiresAuth || requiresAdmin;
  const currentUser = getAuth().currentUser;

  if (requiresAuth && !currentUser)
    next({ path: "/login", query: { redirect: to.fullPath } });
  else if (requiresAuth === false && currentUser) next("/planner");
  else if (requiresAdmin) {
    currentUser
      .getIdTokenResult()
      .then((idTokenResult) => {
        // Confirm the user is an Admin.
        if (idTokenResult.claims.admin) {
          // Show admin UI.
          next();
        } else {
          // Show regular user UI.
          next("/planner");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else next();
});

export default router;
