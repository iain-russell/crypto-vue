<template>
  <div class="container">
    <div id="app">
      <!-- <Navbar /> -->
      <Graph />
    </div>
  </div>
</template>

<script>
import Graph from "./components/Graph.vue";
import Navbar from "./components/Navbar.vue";
import GraphMiniChart from "./components/GraphMiniChart.vue";

export default {
  name: "app",
  components: {
    Graph,
    Navbar,
    GraphMiniChart
  }
};
</script>

<style></style>
