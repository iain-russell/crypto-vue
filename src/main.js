import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import VueApexCharts from "vue-apexcharts";

import Graph from "./components/Graph";
import GraphMegaChart2 from "./components/GraphMegaChart2";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(Buefy);
Vue.use(VueApexCharts);

require("./assets/css/style.css");
require("./assets/main.scss");

export const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Graph },
    { path: "/megachart", name: 'megachart', component: GraphMegaChart2, props: true }
  ]
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
