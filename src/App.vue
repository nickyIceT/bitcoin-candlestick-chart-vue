<template>
  <trading-vue
    :data="chart"
    :width="this.width"
    :height="this.height"
    :color-back="colors.colorBack"
    :overlays="overlays"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText"
    titleTxt="BTCUSDT"
  >
  </trading-vue>
</template>

<script>
import TradingVue from "trading-vue-js";
import PerfectTrades from "./Overlays/PerfectTrades.js";
import axios from "axios";
export default {
  name: "app",
  components: { TradingVue },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.getInitialData();
    setInterval(() => {
      this.getInitialData();
    }, 6 * 1000);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      chart: {
        onchart: [
          {
            name: "Trades",
            type: "PerfectTrades",
            data: [],
            settings: {
              "z-index": 5,
            },
          },
        ],
      },
      width: window.innerWidth,
      height: window.innerHeight,
      night: true,
      overlays: [PerfectTrades],
    };
  },
  methods: {
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    async getInitialData() {
      const result = await axios.get("https://api.binance.com/api/v3/klines", {
        params: { symbol: "BTCUSDT", interval: "5m" },
      });
      const transform = (result.data || []).map((item) => {
        return item.splice(0, 6).map((obj) => Number(obj));
      });
      this.chart = {
        chart: {
          type: "Candles",
          data: transform,
        },
        onchart: [
          {
            ...this.chart.onchart[0],
            data: [
              [
                1658850300000, // timestamp (then trade occured)
                1, // state: 0 = idle, 1 = long
                20781.11, // filled price
                500,
              ],
            ],
          },
        ],
      };
    },
  },
  computed: {
    colors() {
      return this.night
        ? {}
        : {
            colorBack: "#fff",
            colorGrid: "#eee",
            colorText: "#333",
          };
    },
  },
};
</script>
