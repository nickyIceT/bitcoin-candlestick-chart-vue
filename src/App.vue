<template>
  <div>
    <trading-vue
      :data="chart"
      :width="this.width"
      :height="this.height"
      :color-back="colors.colorBack"
      :overlays="overlays"
      :color-grid="colors.colorGrid"
      :color-text="colors.colorText"
      titleTxt="BTCUSDT"
      ref="tradingVue"
    >
    </trading-vue>
    <span class="night-mode">
      <input type="checkbox" v-model="isShowText" />
      <label>Show text</label>
    </span>
  </div>
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
    }, 10 * 1000);
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
      isShowText: false,
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
      const historyLiquidation = await axios.get(
        "https://api.nickyicet.com/api/history-liquidation"
      );
      let historyData = [];
      if (historyLiquidation.data) {
        historyLiquidation.data.data.map((item) => {
          const time = new Date(item.date).getTime();
          const price = item.symbol === "#BTC" ? item.price : item.btcPrice;
          historyData.push([
            time,
            item.type,
            price,
            item.liquidation,
            item.symbol,
          ]);
        });
      }

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
            data: historyData,
            settings: {
              isShowText: this.isShowText,
            },
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
<style scoped>
.night-mode {
  position: absolute;
  top: 10px;
  right: 80px;
  color: #888;
  font: 11px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
</style>
