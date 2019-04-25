<template>
  <div class="center">
    <p> im 'the chart"</p>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <!-- <img :src="this.selected.image" class="image is-32x32" /> -->
          {{ this.selected.name }}
        </p>
      </header>
      <section class="modal-card-body">
        <div>
          <b-select v-model="startDate">
            <option value="lastDay">1d</option>
            <option value="lastWeek">7d</option>
            <option value="lastMonth">1m</option>
            <option value="last3Month">3m</option>
            <option value="LastYear">1y</option>
          </b-select>
        </div>
        <apexchart
          type="line"
          width="150"
          height="50"
          :options="chartOptions"
          :series="series"
        />
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          Close
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "GraphMegaChart",
  components: {
    apexchart: VueApexCharts
  },
  props: ["selected", "selectedPaprika", "currency"],

  created: function() {
    this.getRelevantDates();
    this.getCoinHistory();
    // console.log(this.selected);
    // this.series[0].data = this.selected.sparkline_in_7d.filter((value, index) => {
    // return index % 7 === 0;
    // });
  },
  data() {
    return {
      today: "",
      lastDay: "",
      lastWeek: "",
      lastMonth: "",
      last3Month: "",
      lastYear: "",
      startDate: "lastDay",
      timeInterval: "1d",
      coinHistory: [],
      priceHistory: [],
      series: [
        {
          data: [1, 2, 3]
        }
      ],
      chartOptions: {
        chart: {
          height: 150,
          sparkline: {
            enabled: true
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: 2.5
        },
        // xaxis: {
        //   categories: [],
        //   labels: { show: false }
        // },
        yaxis: {
          categories: [],
          labels: { show: false }
        },
        legend: {
          show: false
        },
        tooltip: {
          enabled: false
        }
      }
    };
  },
  methods: {
    getRelevantDates() {
      // Today
      const today = new Date();
      this.today = today.toISOString().substr(0, 10);
      // Yesterday
      const lastDay = new Date();
      lastDay.setDate(today.getDate() - 1);
      this.lastDay = lastDay.toISOString().substr(0, 10);
      // Week
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      this.lastWeek = lastWeek.toISOString().substr(0, 10);
      // Month
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      this.lastMonth = lastMonth.toISOString().substr(0, 10);
      // 3 Month
      const last3Month = new Date();
      last3Month.setMonth(today.getMonth() - 3);
      this.last3Month = last3Month.toISOString().substr(0, 10);
      // year
      const lastYear = new Date();
      lastYear.setFullYear(today.getFullYear() - 1);
      this.lastYear = lastYear.toISOString().substr(0, 10);
    },
    async getCoinHistory() {
      const { data } = await axios.get(`https://api.coinpaprika.com/v1/tickers/${this.selectedPaprika.id}?quotes=${this.currency}`
      );
      this.coinHistory = data;
    },
    async getCoinHistorySpecific() {
      const { data } = await axios.get(
        `https://api.coinpaprika.com/v1/tickers/
        ${this.selectedPaprika.id}
        /historical?start=${this.startDate}
        &end=${this.today}
        &interval=${this.timeInterval}
        &limit=5000`
      );
    }
  }
};
</script>
