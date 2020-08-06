import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "todomvc-common/base.css";
import "todomvc-common/base.js";
import "todomvc-app-css/index.css";
import "@/assets/app.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
