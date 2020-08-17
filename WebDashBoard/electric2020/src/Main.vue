<template>
  <div id="main">
    <div id="leftmain">
      <div id="timezone">
        <button
          v-on:click="timeRange(index)"
          v-bind:class="timebutton"
          v-for="(time,index) in timelist"
          v-bind:key="index"
        >{{time}}</button>
      </div>
      <div class="canvasframe">
        <h2>실시간 전력 생산량</h2>

        <canvas id="mainCanvas"></canvas>
      </div>
      <div class="canvasframe">
        <h2>실시간 전력 수요량</h2>
        <canvas id="mainCanvas2"></canvas>
      </div>
      <div class="canvasframe">
        <h2>실시간 전력 저장량</h2>
        <canvas id="mainCanvas3"></canvas>
      </div>
    </div>
    <div id="rightmain">
      <MainRightVue></MainRightVue>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import axios from "axios";
import MainRight from './MainRight.vue'
import IP from '../static/setting.json'

let chartd_top = {
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

let chartd_middle = {
  type: "line",
  data: {
    labels: [1, 2, 3],
    datasets: [
      {
        label: "수요량",
        backgroudColor: "rgba(24,23,23,.5)",
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

let chartd_bottom = {
  type: "line",
  data: {
    labels: [1, 2, 3],
    datasets: [
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
  components:{
    MainRightVue : MainRight,
  },
  methods: {
    createChart(charId, chartData) {
      const ctx = document.getElementById(charId);

      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    timeRange(index) {
      let insertKey = this.timekey[index];
      axios
        .get("http://" + IP.IP + ":7272/prosumer/getmainlive", {
          params: { time: insertKey },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status == true) {
            let payload = res.data;

            chartd_top.data.labels = Array.from(
              new Array(payload.output.length),
              (x, i) => i + 1
            ); //[...Array(inputdata.length).keys()];

            chartd_top.data.datasets[0].data = payload.output;

            chartd_middle.data.labels = Array.from(
              new Array(payload.demand.length),
              (x, i) => i + 1
            ); //[...Array(inputdata.length).keys()];

            chartd_middle.data.datasets[0].data = payload.demand;

            chartd_bottom.data.labels = Array.from(
              new Array(payload.storage.length),
              (x, i) => i + 1
            ); //[...Array(inputdata.length).keys()];

            chartd_bottom.data.datasets[0].data = payload.storage;

            this.createChart("mainCanvas", chartd_top);
            this.createChart("mainCanvas2", chartd_middle);
            this.createChart("mainCanvas3", chartd_bottom);
          }
        });
    },
  },
  data() {
    return {
      timekey: ["1h", "2h", "3h", "6h", "1d"],
      timelist: ["1시간", "2시간", "3시간", "6시간", "1일"],
      timebutton: "timeclass btn btn-light btn-sm",
      //linedata: chartd,
    };
  },
  mounted() {
    ///var vm = this;
    axios
      .get("http://" + IP.IP + ":7272/prosumer/getmainlive", {
        params: { time: "1d" },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status == true) {
          let payload = res.data;

          chartd_top.data.labels = Array.from(
            new Array(payload.output.length),
            (x, i) => i + 1
          ); //[...Array(inputdata.length).keys()];

          chartd_top.data.datasets[0].data = payload.output;

          chartd_middle.data.labels = Array.from(
            new Array(payload.demand.length),
            (x, i) => i + 1
          ); //[...Array(inputdata.length).keys()];

          chartd_middle.data.datasets[0].data = payload.demand;

          chartd_bottom.data.labels = Array.from(
            new Array(payload.storage.length),
            (x, i) => i + 1
          ); //[...Array(inputdata.length).keys()];

          chartd_bottom.data.datasets[0].data = payload.storage;

          this.createChart("mainCanvas", chartd_top);
          this.createChart("mainCanvas2", chartd_middle);
          this.createChart("mainCanvas3", chartd_bottom);
        }
      });
  },
};
</script>

<style scoped>
#leftmain {
  /* float: left; */
  width: 60%;
}
#rightmain {
  /* float: inherit; */
}
h2 {
  color: rgb(224, 224, 224);
  font-weight: bold;
}
div#main {
  background-color: #393939;
  display: flex;
  margin: 0rem 2rem 0.5rem 2rem;
}
hr {
  border-top: 2px solid;
  margin: 0rem 0.5rem 0rem 0.5rem;
}

div#timezone {
  display: flex;
  justify-content: flex-end;
}
.timeclass {
  width: 5rem;
  margin: 3px;
}
canvas {
  height: 80%;
  width: 100%;
  margin: 1rem 1rem 1rem 1rem;
  background-color: rgb(224, 224, 224);
}
.canvasframe {
  margin: 2rem 2rem 1rem 2rem;
}
</style>
