<template>
  <div class="center">
    <section class="section">
      <div class="content">
        <h3>About CoinSushi</h3>
        <p>
          CoinSushi is a single page application built using Vue.js, Bulma, and
          Buefy. Like me, it has no style.

          <br /><br />It uses two APIs, CoinGecko and Coinpaprika. The charts on
          the site are built using ApexCharts. <br /><br />CoinSushi is hosted
          on an AWS EC2 server. It is deployed using Docker and Nginx.
          <br /><br />
          The code can be seen on github.
          <br />
          <a href="https://github.com/iain-russell/crypto-vue"
            >https://github.com/iain-russell/crypto-vue</a
          >
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>
<style scoped>
.section {
  padding-top: 0px;
}
</style>
