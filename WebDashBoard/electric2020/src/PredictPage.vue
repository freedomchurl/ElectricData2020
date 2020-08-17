<template>
  <div id="main">
    <div id="leftmain">
      <div id="timezone">
        <span id="combobox-name">PROSUMER 선택</span>
        <select v-on:change="getPredict" class="combo" v-model="selected">
          <option
            v-for="(prosumer,index) in prosumerList"
            v-bind:value="prosumer.pID"
            v-bind:key="index"
          >{{ prosumer.name }}</option>
        </select>
      </div>
      <div class="canvasframe">
        <h2>실시간 전력거래소 가격 예측량</h2>

        <canvas id="mainCanvas"></canvas>
      </div>
      <div class="canvasframe">
        <h2>실시간 전력 생산 예측량</h2>
        <canvas id="mainCanvas2"></canvas>
      </div>
      <div class="canvasframe">
        <h2>실시간 전력 수요 예측량</h2>
        <canvas id="mainCanvas3"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import axios from "axios";

import IP from '../static/setting.json'

let chartd_top = {
  type: "line",
  data: {
    labels: [1, 2, 3],
    datasets: [
      {
        label: "가격 예측",
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
        label: "생산량",
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
        label: "수요량",
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
    getPredict() {
      console.log('실행되어라');
      console.log(this.selected);
      axios
        .get("http://" + IP.IP + ":7272/prosumer/predictall", {
          params: { pID: this.selected },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status == true) {
              let payload_data = res.data.payload;
              console.log(payload_data.retail);
              chartd_top.data.labels = Array.from(
                new Array(payload_data.retail.length),
                (x, i) => i + 1
              ); //[...Array(inputdata.length).keys()];

              chartd_top.data.datasets[0].data = payload_data.retail;

              chartd_middle.data.labels = Array.from(
                new Array(payload_data.output.length),
                (x, i) => i + 1
              ); //[...Array(inputdata.length).keys()];

              chartd_middle.data.datasets[0].data = payload_data.output;

              chartd_bottom.data.labels = Array.from(
                new Array(payload_data.demand.length),
                (x, i) => i + 1
              ); //[...Array(inputdata.length).keys()];

              chartd_bottom.data.datasets[0].data = payload_data.demand;

              this.createChart("mainCanvas", chartd_top);
              this.createChart("mainCanvas2", chartd_middle);
              this.createChart("mainCanvas3", chartd_bottom);
            }
        });
    },
  },
  computed: {
    redraw(){
      console.log(this.selected);
      this.getPredict(this.selected) 
      return this.selected;
    }
  },
  data() {
    return {
      timekey: ["1h", "2h", "3h", "6h", "1d"],
      timelist: ["1시간", "2시간", "3시간", "6시간", "1일"],
      timebutton: "timeclass btn btn-light btn-sm",
      //linedata: chartd,
      selected: "1",
      prosumerList: [{pID:1,pName:"aaa"},{pID:2,pName:"bbb"}],
    };
  },
  mounted() {
    var vm = this;
    /*
      여기서, 프로슈머 리스트를 받아와야 함. 그래서 PID, PName을 갖고 있어야 한다.
    */
    axios
      .get("http://" + IP.IP + ":7272/prosumer/all")
      .then((res) => {
        if (res.data.status == true) {
          vm.prosumerList = res.data.payload;
          vm.selected = res.data.payload[0].pID; // 첫번째 Element를 선택하도록 한다.
          console.log(vm.selected);
          // 모든 유저를 가져와야 함
        }
      })
      .then(() => {
        axios
          .get("http://" + IP.IP + ":7272/prosumer/predictall", {
            params: { pID: vm.selected },
          })
          .then((res) => {
            console.log("과연");
            console.log(res.data);
            if (res.data.status == true) {
              let payload_data = res.data.payload;
              console.log(payload_data.retail);
              chartd_top.data.labels = Array.from(
                new Array(payload_data.retail.length),
                (x, i) => i + 1
              ); //[...Array(inputdata.length).keys()];

              chartd_top.data.datasets[0].data = payload_data.retail;

              chartd_middle.data.labels = Array.from(
                new Array(payload_data.output.length),
                (x, i) => i + 1
              ); //[...Array(inputdata.length).keys()];

              chartd_middle.data.datasets[0].data = payload_data.output;

              chartd_bottom.data.labels = Array.from(
                new Array(payload_data.demand.length),
                (x, i) => i + 1
              ); //[...Array(inputdata.length).keys()];

              chartd_bottom.data.datasets[0].data = payload_data.demand;

              this.createChart("mainCanvas", chartd_top);
              this.createChart("mainCanvas2", chartd_middle);
              this.createChart("mainCanvas3", chartd_bottom);
            }
          });
      });

    // 아래가 이 위로 들어와야 함.
  },
};
</script>

<style scoped>
#leftmain {
  /* float: left; */
  width: 100%;
}
#combobox-name {
  color: rgb(135, 191, 25);
  margin: 0rem 1rem 0rem 1rem;
  font-weight: bold;
  font-size: 1.5rem;
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
.combo {
  background-color: white;
  width: 15%;
  height: 10%;
  margin: 0.5rem 1rem 0rem 0rem;
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
  width: 100%;
  height: 80%;
  margin: 1rem 1rem 1rem 1rem;
  background-color: rgb(224, 224, 224);
}
.canvasframe {
  margin: 2rem 2rem 1rem 2rem;
}
</style>
