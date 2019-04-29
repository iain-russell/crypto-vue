<template>
  <div class="center">
    <apexchart
      type="line"
      width="160"
      height="55"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "GraphMiniChart",
  components: {
    apexchart: VueApexCharts
  },
  props: ["sparklineData"],

  created: function() {
    this.series[0].data = this.sparklineData.filter((value, index) => {
      return index % 7 === 0;
    });
  },
  data() {
    return {
      series: [
        {
          data: []
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
          width: 1.5
        },
        tooltip: {
          enabled: false
        }
      }
    };
  },
  methods: {
  }
};
</script>
