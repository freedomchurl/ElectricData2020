<template>
  <div id="cardmain">
    <div id="flexcard">
      <img class="iconimg" v-bind:src="houseicon" />
      <h2 id="pname-div">{{pName}}</h2>
    </div>
    <!-- <span>{{livedata}}</span> -->
    <canvas v-bind:id="pName"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import { EventBus } from "./event-bus.js";

let chartd = {
  type: "line",
  data: {
    labels: [1, 2, 3],
    datasets: [
      {
        label: "생산량",
        // data: [3, 4, 5, 4, 2],//, 1, 2, 3, 2, 1, 2, 3, 4, 2, 3],
        backgroudColor: "rgba(54,73,93,.5)",
        borderColor: "#36495d",
        borderWidth: 3,
      },
      {
        label: "수요량",
        backgroudColor: "rgba(24,23,23,.5)",
        borderColor: "#36495d",
        borderWidth: 3,
      },
      {
        label: "저장량",
        backgroudColor: "rgba(110,73,110,.5)",
        borderColor: "#36495d",
        borderWidth: 3,
      },
    ],
  },
  options: {
    responsive: true,
    lineTension: 1,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
            padding: 25,
          },
        },
      ],
    },
  },
};

export default {
  methods: {
    createChart(charId, chartData) {
      const ctx = document.getElementById(charId);
      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
  },
  data() {
    return {
      houseicon: require("../static/houseicon_active.png"),
      pName: this.prosumerdata.name,
      pID: this.prosumerdata.pID,
      mydata: this.livedata,
    };
  },
  props: ["prosumerdata", "livedata"],
  mounted() {
    this.createChart(this.pName, chartd);
    var vm = this;
    EventBus.$on("live", function () {
      //console.log("change");
      chartd.data.labels = Array.from(
        new Array(vm.livedata.output.length),
        (x, i) => i + 1
      ); //[...Array(outputdata.length).keys()];
      chartd.data.datasets[0].data = vm.livedata.output;
      chartd.data.datasets[1].data = vm.livedata.demand;
      chartd.data.datasets[2].data = vm.livedata.storage;
      vm.createChart(vm.pName, chartd);
    }); // index를 넘겨준다.
  },
  watch: {
    drawGraph: function () {
      console.log("JIMIN");
      chartd.data.labels = Array.from(
        new Array(this.livedata.output.length),
        (x, i) => i + 1
      ); //[...Array(outputdata.length).keys()];
      chartd.data.datasets[0].data = this.livedata.output;
      chartd.data.datasets[1].data = this.livedata.demand;
      chartd.data.datasets[2].data = this.livedata.storage;
      this.createChart(this.pName, chartd);
    },
  },
};
</script>

<style scoped>

#flexcard {
  display: flex;
  align-content: center;
  margin: 1rem 1rem 1rem 1rem;
}
#pname-div {
  text-align: center;
  margin: 0;
  align-content: center;
  display: initial;
  color: rgb(224, 224, 224);
}
.iconimg {
  width: 10%;
  display: left;
  margin: 0rem 1rem 0rem 1rem;
}
canvas {
  background-color: white;
  width: 100%;
}
</style>