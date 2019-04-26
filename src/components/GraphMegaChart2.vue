<template>
  <div>
    <section class="">
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">24hr High</p>
            <p class="subtitle"></p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">24hr Low</p>
            <p class="subtitle"></p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">24hr Range</p>
            <p class="subtitle"></p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">All time high</p>
            <p class="subtitle">{{ this.currencyUnit }}{{ this.ath }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">From ATH</p>
            <p class="subtitle"></p>
          </div>
        </div>
      </nav>
    </section>
    <section class="section">
      <div class="center">
        <button class="button" :value="this.lastDay" @click="setStartDate">
          1d
        </button>
        <button class="button" :value="this.lastWeek" @click="setStartDate">
          7d
        </button>
        <button class="button" :value="this.lastMonth" @click="setStartDate">
          1m
        </button>
        <button class="button" :value="this.last3Month" @click="setStartDate">
          3m
        </button>
        <button class="button" :value="this.lastYear" @click="setStartDate">
          1y
        </button>
      </div>
      <div class="center">
        <apexchart
          type="area"
          width="800"
          height="400"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "GraphMegaChart2",
  components: {
    apexchart: VueApexCharts
  },
  props: ["selected", "selectedPaprika", "currency", "currencyUnit"],

  data() {
    return {
      today: "",
      lastDay: "",
      lastWeek: "",
      lastMonth: "",
      last3Month: "",
      lastYear: "",
      startDate: "",
      timeInterval: "30m",
      coinHistory: [],
      coinHistoryPaprika: [],
      priceHistory: [],
      ath: "",
      series: [
        {
          data: []
        }
      ],
      chartOptions: {
        chart: {
          height: 150,
          zoom: {
            enabled: false
          }
        },
        stroke: {
          curve: "smooth",
          width: 2.5
        },
        xaxis: {
          // type: "datetime"
          categories: []
        }
        // },
      }
    };
  },
  watch: {
    startDate: function() {}
  },
  created: function() {
    this.getRelevantDates();
    this.startDate = this.lastDay;
    this.getCoinHistory();
    this.getCoinHistoryPaprika();
    this.getCoinHistoryPaprikaSpecific();
    this.findCoinAth();
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
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${this.selected.id}`
      );
      // console.log(data);
      this.coinHistory = data;
      this.ath = this.coinHistory.market_data.ath[this.currency];
      // console.log(this.ath);
    },
    async getCoinHistoryPaprika() {
      const { data } = await axios.get(
        `https://api.coinpaprika.com/v1/tickers/${
          this.selectedPaprika.id
        }?quotes=${this.currency}`
      );
      // console.log(data);
      this.coinHistoryPaprika = data;
    },
    async getCoinHistoryPaprikaSpecific() {
      const { data } = await axios.get(
        `https://api.coinpaprika.com/v1/tickers/${
          this.selectedPaprika.id
        }/historical?start=${this.startDate}&end=${this.today}&interval=${
          this.timeInterval
        }&limit=356`
      );
      // console.log(data);
      this.priceHistory = data;
      this.series[0].data = [];
      this.priceHistory.forEach(coin => {
        this.series[0].data.push({ x: coin.timestamp, y: coin.price });
        // this.chartOptions.xaxis.categories.push(coin.timestamp);
      });
    },
    setStartDate(event) {
      this.startDate = event.target.value;
      if (this.startDate === this.lastDay) {
        this.timeInterval = "15m";
      } else if (this.startDate === this.lastWeek) {
        this.timeInterval = "2h";
      } else if (this.startDate === this.lastMonth) {
        this.timeInterval = "12h";
      } else if (this.startDate === this.last3Month) {
        this.timeInterval = "1d";
      } else if (this.startDate === this.lastYear) {
        this.timeInterval = "7d";
      }
      this.getCoinHistoryPaprikaSpecific();
    },
    async findCoinAth() {
      // this.ath = await this.coinHistory;
      // console.log(this.ath);
    }
  }
};
</script>
