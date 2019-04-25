<template>
  <div class="container">
    <div id="app">
      <Navbar />
      <router-view> </router-view>
      <!-- <Graph /> -->
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "app",
  components: {
    Navbar
  }
};
</script>

<style></style>
