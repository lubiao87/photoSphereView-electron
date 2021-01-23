import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: '/home',
    name: 'home',
    component: () => import("./views/home/Home.vue"),
    meta: {
      auth: true, // 这里设置，当前路由需要校验
      keepAlive: false // 缓存
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("./views/login/login.vue"),
    meta: {
      auth: false, // 这里设置，当前路由需要校验
      keepAlive: false // 缓存
    }
  },
  {
    path: '/photoSphere',
    name: 'photoSphere',
    component: () => import("./views/photoSphere/PhotoSphereViewer.vue"),
    meta: {
      auth: false, // 这里设置，当前路由需要校验
      keepAlive: false // 缓存
    }
  },
];

const router = new Router({
  // mode: 'hash',
  routes,
  // mode: "history",
  // base:
  //   process.env.NODE_ENV === "development" ? process.env.BASE_URL : "/transWeb" //transWeb是生产环境放代码的目录
});
router.beforeResolve((to, from, next) => {
  // console.log(to.matched, "to.matched");
  if (to.matched.some(m => m.meta.auth)) {
    if (localStorage.getItem("loginData")) {
      //已经登陆
      let isAccess = false;

      if (to.fullPath.indexOf("/home") >= 0) {
        //主页权限
        isAccess = true;
      }
      if (isAccess) {
        // console.log("有权限");
        next();
      } else {
        // console.log("无权限");
        next({ path: "/login" });
      }
    } else {
      next({ path: "/login" });
    }
  } else {
    next();
  }
});
export default router;