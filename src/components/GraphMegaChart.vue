<template>
  <div>
    <section class="">
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">24hr High</p>
            <p class="subtitle">{{ this.currencyUnit + this.high_24h }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">24hr Low</p>
            <p class="subtitle">{{ this.currencyUnit + this.low_24h }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">24hr</p>
            <span class="tag is-medium">
            <p class="subtitle" :class="pricePercent(this.selected.price_change_percentage_24h)">{{ this.selected.price_change_percentage_24h.toFixed(2)}}%</p>
          </span>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">All time high</p>
            <p class="subtitle">{{ this.currencyUnit + this.ath }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">From ATH</p>
            <p class="subtitle">{{ this.ath_change_percentage }}%</p>
          </div>
        </div>
      </nav>
    </section>
    <section class="section" id="chart-section">
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
      <apexchart
        id="chart"
        type="area"
        height="400"
        :options="chartOptions"
        :series="series"
      />
    </section>
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
      high_24h: "",
      low_24h: "",
      ath_change_percentage: "",
      series: [
        {
          data: []
        }
      ],
      chartOptions: {
        chart: {
          height: 150
        },
        stroke: {
          curve: "smooth",
          width: 2.5
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          style: {
            fontSize: "14px"
          },
          x: {
            show: false
          },
          y: {
            formatter: value => this.currencyUnit + value,
            title: {
              formatter: seriesName => `${this.selected.name} price`
            }
          },
          marker: { show: false }
        },
        xaxis: {
          labels: {
            show: false
          }
        },
        yaxis: {
          labels: {
            formatter: value => this.currencyUnit + value
          }
        }
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
      this.coinHistory = data;
      this.ath = this.coinHistory.market_data.ath[this.currency];
      this.high_24h = this.coinHistory.market_data.high_24h[this.currency];
      this.low_24h = this.coinHistory.market_data.low_24h[this.currency];
      this.ath_change_percentage = this.coinHistory.market_data.ath_change_percentage[
        this.currency
      ].toFixed(2);
    },
    async getCoinHistoryPaprika() {
      const { data } = await axios.get(
        `https://api.coinpaprika.com/v1/tickers/${
          this.selectedPaprika.id
        }?quotes=${this.currency}`
      );
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
      this.priceHistory = data;
      this.series[0].data = [];
      this.priceHistory.forEach(coin => {
        const coin_date = new Date(coin.timestamp);
        const formatted_date = coin_date
          .toISOString()
          .substr(0, 19)
          .replace("T", " ");
        this.series[0].data.push({ x: formatted_date, y: coin.price });
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
    pricePercent(price) {
      if (price > 0) {
        return "has-text-primary";
      } else {
        return "has-text-danger";
      }
    },
  }
};
</script>

<style scoped>
.button {
  margin: 10px;
}
.heading {
  font-size: 12px;
}
#chart-section {
  padding-left: 0px;
}
</style>
