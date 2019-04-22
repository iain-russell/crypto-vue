import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import VueApexCharts from 'vue-apexcharts'

Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(VueApexCharts);


require("./assets/css/style.css");
require("./assets/main.scss");


new Vue({
  render: h => h(App)
}).$mount("#app");
