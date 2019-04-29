<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-item">
        <router-link to="/" class="navbar-item">
          <p class="subtitle sushi-title">CoinSushi</p>
        </router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <router-link to="/about" class="navbar-item">
            <p class="subtitle">
              About
            </p>
          </router-link>
        </div>
      </div>
    </nav>
    <hr>
  </div>
</template>

<script>
export default {
  name: "Navbar"
};
</script>
<style scoped>
.sushi-title {
  font-family: "Nunito", sans-serif;
  font-size: 32px;
  font-weight: 700;
}
.navbar {
  padding: 10px;
}
hr {
  margin-top: 0px;
}
</style>
