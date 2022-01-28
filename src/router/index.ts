import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Penalty from "../views/Penalty.vue";
import store from "../store";
import Pray from "../views/Pray.vue";
import User from "../views/User.vue";
import Tweets from "../views/Tweets.vue";
import Prays from "../views/Prays.vue";
import Penaltys from "../views/Penaltys.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "홈",
    component: Home,
    meta: {
      isMenu: true,
      layout: "Default",
      requireAuth: true,
      icon: "mdi mdi-home",
      bottom: true,
    },
    props: true,
  },
  {
    path: "/user/:id",
    name: "내 정보",
    component: User,
    meta: {
      isMenu: true,
      layout: "Default",
      requireAuth: true,
      icon: "mdi mdi-account",
      bottom: true,
    },
    props: true,
    children: [
      {
        name: "내 정보",

        path: "",
        component: Tweets,
        meta: {
          layout: "Default",
          requireAuth: true,
        },
      },

      {
        name: "내 정보",

        path: "prays",
        component: Prays,
        meta: {
          layout: "Default",
          requireAuth: true,
        },
      },
      {
        name: "내 정보",

        path: "penaltys",
        component: Penaltys,
        meta: {
          layout: "Default",
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: { isMenu: false, layout: "Empty", requireAuth: false },
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    meta: { isMenu: false, layout: "Empty", requireAuth: false },
    component: Register,
  },
  {
    path: "/pray",
    name: "기도제목",
    meta: {
      isMenu: true,
      layout: "Default",
      requireAuth: true,
      icon: "mdi mdi-baby",
      bottom: true,
    },
    component: Pray,
  },
  {
    path: "/penalty",
    name: "벌금",
    meta: {
      isMenu: true,
      layout: "Default",
      requireAuth: true,
      icon: "mdi mdi-cash-multiple",
      bottom: true,
    },
    props: true,
    component: Penalty,
  },

  // {
  //   path: "/search/:keyword",
  //   name: "검색",
  //   meta: {
  //     isMenu: true,
  //     layout: "Default",
  //     requireAuth: true,
  //     icon: "mdi mdi-magnify",
  //   },
  // },
];

const router = new VueRouter({
  mode: "history",

  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = store.state.user;
  const requireAuth = to.matched.some((record) => record.meta.requireAuth);
  if (requireAuth && !currentUser) {
    next("/login");
  } else {
    console.log("checking");
    next();
  }
});

export default router;
