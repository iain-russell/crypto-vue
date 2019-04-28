<template>
  <div>
    <section class="" id="market-info">
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Market Cap</p>
            <p class="subtitle">{{ this.currencyUnit + this.marketCap }}</p>
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
            {{ currencyUnit + formatNumber(props.row.market_cap) }}
          </b-table-column>
          <b-table-column
            field="current_price"
            label="Price"
            numeric
            sortable
            centered
          >
            {{ currencyUnit + formatPrice(props.row.current_price) }}
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

export default {
  name: "Graph",
  components: { GraphMiniChart },
  data: function() {
    return {
      coins: [],
      coinsPaprika: [],
      currency: "eur",
      currencyUnit: "",
      loading: false,
      sparklineData: [],
      selected: null,
      selectedPaprika: "",
      currencies: [],
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
    this.getCurrencies();
  },
  watch: {
    currency: function() {
      this.getCoins();
      this.getMarketCap();
      this.findCurrencyUnit();
    },
    selected: function() {
      this.updateSelectedCoinPaprika();
      this.clickMegaChart();
    }
  },
  computed: {},
  methods: {
    async getCoins() {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${
          this.currency
        }&order=market_cap_desc&per_page=100&page=1&sparkline=true`
      );
      this.coins = data;
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
    async getCurrencies() {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/exchange_rates"
      );
      this.currencies = data.rates;
      this.findCurrencyUnit();
    },
    findCurrencyUnit() {
      this.currencyUnit = this.currencies[this.currency].unit;
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
        name: "megachart",
        params: {
          selected: this.selected,
          selectedPaprika: this.selectedPaprika,
          currency: this.currency,
          currencyUnit: this.currencyUnit
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
</style>
