<template>
  <div>
    <section class="" id="market-info">
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Market Cap</p>
            <p class="subtitle">{{ this.sign() }}{{ this.marketCap }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Market Dominance</p>
            BTC <b>{{ this.btcDominance }}</b
            >% ETH <b>{{ this.ethDominance }}</b
            >% XRP <b>{{ this.xrpDominance }}</b
            >%
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Currency</p>
            <b-select v-model="currency" icon="earth" class="currency-selector">
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
              <option value="usd">USD</option>
            </b-select>
          </div>
        </div>
      </nav>
    </section>
    <section class="section" id="table-section">
      <b-table
        class="card"
        :data="coins"
        :paginated="true"
        :hoverable="true"
        :striped="true"
        :loading="loading"
        :perPage="25"
        :selected.sync="selected"
      >
        <template slot-scope="props">
          <b-table-column
            field="market_cap_rank"
            label="Rank"
            width="20"
            numeric
            sortable
            ><p>
              {{ props.row.market_cap_rank }}
            </p>
          </b-table-column>
          <b-table-column
            field="name"
            label="Name"
            width="200"
            sortable
            centered
          >
            <article class="media center">
              <figure class="media-left">
                <img :src="props.row.image" class="image is-24x24" />
              </figure>
              <div class="media-content">
                <b>{{ props.row.name }}</b>
              </div>
            </article>
          </b-table-column>
          <b-table-column
            field="market_cap"
            label="Market Cap"
            numeric
            sortable
            centered
          >
            {{ sign() + formatNumber(props.row.market_cap) }}
          </b-table-column>
          <b-table-column
            field="current_price"
            label="Price"
            numeric
            sortable
            centered
          >
            {{ sign() + formatPrice(props.row.current_price) }}
          </b-table-column>
          <b-table-column
            class="is-right"
            field="circulating_supply"
            label="Circulating"
            numeric
            sortable
            centered
          >
            {{ formatNumber(props.row.circulating_supply.toFixed()) }}
          </b-table-column>
          <b-table-column
            field="symbol"
            label="Symbol"
            width="80"
            sortable
            centered
          >
            {{ props.row.symbol.toUpperCase() }}
          </b-table-column>
          <b-table-column
            field="price_change_percentage_24h"
            label="24hr"
            sortable
            centered
          >
            <span class="tag is-medium">
              <p :class="pricePercent(props.row.price_change_percentage_24h)">
                {{ props.row.price_change_percentage_24h.toFixed(2) }}%
              </p>
            </span>
          </b-table-column>
          <b-table-column field="sparkline_in_7d" label="Weekly" centered>
            <GraphMiniChart :sparklineData="props.row.sparkline_in_7d.price">
            </GraphMiniChart>
          </b-table-column>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { router } from "../main.js";

import GraphMiniChart from "./GraphMiniChart";
import GraphMegaChart from "./GraphMegaChart";

export default {
  name: "Graph",
  components: { GraphMiniChart, GraphMegaChart },
  data: function() {
    return {
      coins: [],
      coinsPaprika: [],
      currency: "eur",
      loading: false,
      sparklineData: [],
      selected: null,
      selectedPaprika: "",
      marketData: [],
      marketCap: [],
      btcDominance: "",
      ethDominance: "",
      xrpDominance: ""
    };
  },
  created: function() {
    this.getCoins();
    this.getCoinsPaprika();
    this.getMarketCap();
  },
  watch: {
    currency: function() {
      this.getCoins();
      this.getMarketCap();
    },
    selected: function() {
      this.updateSelectedCoinPaprika();
      this.clickMegaChart();
    }
  },
  computed: {},
  methods: {
    async getCoins() {
      this.loading = true;
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${
          this.currency
        }&order=market_cap_desc&per_page=100&page=1&sparkline=true`
      );
      this.coins = data;
      this.loading = false;
    },
    async getCoinsPaprika() {
      const { data } = await axios.get("https://api.coinpaprika.com/v1/coins");
      this.coinsPaprika = data;
    },
    formatNumber(num) {
      if (num < 1) {
        return num.toFixed(4);
      } else {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
    },
    formatPrice(price) {
      if (price < 1) {
        return price.toFixed(4);
      } else {
        return price
          .toFixed(2)
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
    },
    pricePercent(price) {
      if (price > 0) {
        return "has-text-primary";
      } else {
        return "has-text-danger";
      }
    },
    sign() {
      if (this.currency === "eur") {
        return "€";
      } else if (this.currency === "gbp") {
        return "£";
      } else if (this.currency === "usd") {
        return "$";
      }
    },
    async getMarketCap() {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/global`
      );
      this.marketData = data.data;
      this.marketCap = this.formatNumber(
        data.data.total_market_cap[this.currency].toFixed()
      );
      this.btcDominance = data.data.market_cap_percentage.btc.toFixed(2);
      this.ethDominance = data.data.market_cap_percentage.eth.toFixed(2);
      this.xrpDominance = data.data.market_cap_percentage.xrp.toFixed(2);
    },
    updateSelectedCoinPaprika() {
      this.selectedPaprika = this.coinsPaprika.find(
        coin => coin.name === this.selected.name
      );
    },
    clickMegaChart(payload) {
      router.push({
        // path: '/megachart',
        name: "megachart",
        params: {
          selected: this.selected,
          selectedPaprika: this.selectedPaprika,
          currency: this.currency
        }
      });
    }
  }
};
</script>

<style scoped>
table td {
  vertical-align: middle;
  cursor: pointer;
}
.is-selected {
  background-color: white !important;
}
#margin-info {
  padding-top: none;
  margin-top: 0;
}
/* #table-section {
  padding-top: 0;
} */
</style>
