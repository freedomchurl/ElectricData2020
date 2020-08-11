<template>
  <div id="main">
    <div id="titlebox">
      <div id="leftbox">
        <div id="listtitle">
          <img class="iconimg" v-bind:src="houseicon" />
          <h2>{{this.$route.params.data.name}}</h2>
          <!-- {{this.$route.params.data.index + ' ' + this.$route.params.data.name}} -->
        </div>
      </div>
      <button id="modify" v-bind:class="modifybutton">정보 수정</button>
    </div>
    <!-- <div id="flexbox">
      <CardProsumer v-on:click.native="detailevent(index)" v-for="(menuname,index) in menulist" v-bind:key="index" id="cardprosumer"></CardProsumer>
    </div>-->

    <div class="detail-data">
      <div class="detail-card detail-card1">
        <h2 class="card-value">{{pavg.output}}</h2>
        <h4 class="card-name">월 평균 생산량</h4>
      </div>
      <div class="detail-card detail-card2">
        <h2 class="card-value">{{pavg.demand}}</h2>
        <h4 class="card-name">월 평균 수요량</h4>
      </div>
      <div class="detail-card detail-card3">
        <h2 class="card-value">{{pavg.storage}}</h2>
        <h4 class="card-name">월 평균 저장량</h4>
      </div>
    </div>
    <div class="detail-data">
      <div class="detail-card detail-card4">
        <h2 class="card-value">{{pavg.town}}</h2>
        <h4 class="card-name">월 평균 타운내 구매량</h4>
      </div>
      <div class="detail-card detail-card5">
        <h2 class="card-value">{{pavg.ex}}</h2>
        <h4 class="card-name">월 평균 전력거래소 구매량</h4>
      </div>
      <div class="detail-card detail-card6">
        <h2 class="card-value">{{pavg.sales}}</h2>
        <h4 class="card-name">월 평균 전력판매 판매량</h4>
      </div>
    </div>

    <!-- -->
    <div class="graph-area">
      <div class="graph-card">
        <div id="listtitle">
          <img class="iconimg" v-bind:src="houseicon" />
          <h2 class="graph-title">전력 변화 추이</h2>
          <hr class="graph-line" />
        </div>
        <!-- <div id="memo-content"></div> -->
        <canvas id="mainCanvas-1"></canvas>
      </div>

      <div class="graph-card">
        <div id="listtitle">
          <img class="iconimg" v-bind:src="houseicon" />
          <h2 class="graph-title">전력 거래량</h2>
          <hr class="graph-line" />
        </div>
        <canvas id="mainCanvas-2"></canvas>
      </div>
    </div>
    <!-- -->
    <div id="memo-card">
      <h2 class="memo-text">메모</h2>
      <div id="memo-content">{{memocontent}}</div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import axios from "axios";

let chartd_left = {
  type: "line",
  data: {
    labels:[1,2,3],
    datasets: [
      {
        label: "생산량",
        // data: [3, 4, 5, 4, 2],//, 1, 2, 3, 2, 1, 2, 3, 4, 2, 3],
        backgroudColor: 
          "rgba(54,73,93,.5)",
        borderColor: "#36495d", 
        borderWidth: 3,
      },{
        label:"수요량",
        backgroudColor: "rgba(24,23,23,.5)",
        borderColor: "#36495d", 
        borderWidth: 3,},
        {
          label:"저장량",backgroudColor: 
          "rgba(110,73,110,.5)",
          borderColor: "#36495d", 
          borderWidth: 3,}
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

let chartd_right = {
  type: "line",
  data: {
    datasets: [
      {
        label: "타운 내 구매량",
        backgroudColor: 
          "rgba(54,73,93,.5)",
        borderColor: "#36495d",
        borderWidth: 3,
      },{
        label: "전력거래소 구매량",
        backgroudColor: 
          "rgba(54,73,93,.5)",
        borderColor: "#36495d",
        borderWidth: 3,
      },{
        label: "전력 판매량",
        backgroudColor: 
          "rgba(54,73,93,.5)",
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
      logo: require("../static/logo.png"),
      houseicon: require("../static/houseicon_active.png"),
      houseicon_d: require("../static/houseicon_deactive.png"),
      modifybutton: "timeclass btn btn-light btn-sm",
      // linedata: chartd,
      memocontent: "",
      pavg: {
        output: "",
        demand: "",
        storage: "",
        town: "",
        ex: "",
        sales: "",
      },
    };
  },
  mounted() {
    const vm = this;
    console.log("Why!");
    // console.log(vm.$route.params.data.name + '!!!');
    axios
      .get("http://127.0.0.1:7272/prosumer/getdetail", {
        params: { pID: vm.$route.params.data.pID },
      })
      .then((res) => {
        console.log(res.data);
        console.log('aaa')
        if (res.data.status == true) {
          //vm.prosumerList = res.data.payload;
          vm.memocontent = res.data.payload[0].memo;

          // 여기에는, 세부 데이터들 가져오기
          console.log('why');
          axios
            .get("http://127.0.0.1:7272/prosumer/getdetaildata", {
              params: { pID: vm.$route.params.data.pID },
            })
            .then((res) => {
              console.log(res.data);
              if (res.data.status == true) {
                let input = res.data.payload.input;
                vm.pavg.output = input.avg_output.toFixed(3);
                vm.pavg.demand = input.avg_demand.toFixed(3);
                vm.pavg.storage = input.avg_storage.toFixed(3);

                let output = res.data.payload.output;
                vm.pavg.ex = output.avg_ex.toFixed(3);
                vm.pavg.town = output.avg_town.toFixed(3);
                vm.pavg.sales = output.avg_sales.toFixed(3);
                console.log("Finish");

                let inputdata = res.data.payload.input.data;
                let outputdata = res.data.payload.output.data;
                chartd_left.data.labels = Array.from(new Array(inputdata.length),(x,i)=>i+1)//[...Array(inputdata.length).keys()];
                chartd_right.data.labels = Array.from(new Array(outputdata.length),(x,i)=>i+1)//[...Array(outputdata.length).keys()];

                console.log(chartd_left.labels);
                console.log(chartd_right.labels);

                let i_outputArr = [];
                let i_demandArr = [];
                let i_storageArr = [];
                for(let i=0;i<inputdata.length;i++)
                {
                  i_outputArr.push(inputdata[i].output)
                  i_demandArr.push(inputdata[i].demand);
                  i_storageArr.push(inputdata[i].storage);
                }

                let o_salesArr = [];
                let o_exArr = [];
                let o_townArr = [];
                for(let i=0;i<outputdata.length;i++)
                {
                  o_salesArr.push(outputdata[i].sales)
                  o_exArr.push(outputdata[i].purchase_ex);
                  o_townArr.push(outputdata[i].purchase_town);
                }

                chartd_left.data.datasets[0].data = i_outputArr;
                chartd_left.data.datasets[1].data = i_demandArr;
                chartd_left.data.datasets[2].data = i_storageArr;
               
                chartd_right.data.datasets[0].data = o_salesArr;
                chartd_right.data.datasets[1].data = o_exArr;
                chartd_right.data.datasets[2].data = o_townArr;

                console.log(i_demandArr);
                console.log(o_salesArr);

                vm.createChart("mainCanvas-1", chartd_left);
                vm.createChart("mainCanvas-2", chartd_right);
              }
            });
        }
      });

    
  },
};
</script>

<style scoped>
.graph-line {
  border-top: 2px solid yellow;
  margin: 0rem 0.5rem 0rem 0.5rem;
}
.graph-title {
  font-size: 1.5rem;
  margin: 1rem 1rem 1rem 0rem;
}
.iconimg {
  margin: 1rem 1rem 1rem 1rem;
}
.graph-area {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.graph-card {
  width: 640px;
  height: 400px;
  background-color: rgb(98, 98, 98);
  padding: 0rem 0rem 0rem 0rem;
  margin: 0rem 0rem 1.5rem 0rem;
  box-shadow: 2px 2px 2px 2px #232323;
}
#memo-content {
  height: 200px;
  margin: 2rem 2rem 1rem 2rem;
  font-size: 1.5rem;
  color: rgb(224,224,224);
}
.memo-text {
  margin: 1rem 0rem 1rem 1rem;
  padding: 2rem 0rem 1rem 1rem;
}
#memo-card {
  margin: 1rem 0rem 1rem 0rem;
  background-color: rgb(98, 98, 98);
  box-shadow: 2px 2px 2px 2px #232323;
}

.card-value {
  font-size: 3rem;
  height: 70%;
  /* color:rgb(51,51,51); */
  line-height: 126px;
}
.card-name {
  height: 30%;
  color: rgb(135, 191, 25);
  align-content: center;
}
.detail-card {
  background-color: rgb(98, 98, 98);
  width: 400px;
  text-align: center;
  height: 180px;
  margin: 1rem 0rem 1rem 0rem;
  box-shadow: 2px 2px 2px 2px #232323;
}
.detail-data {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  margin: 1rem 0rem 1rem 0rem;
}

#modify {
  margin: 6.5rem 0rem 2.5rem 0rem;
  align-content: right;
}
h2 {
  color: rgb(224, 224, 224);
  font-weight: bold;
  margin: 0rem 0 0 0.5rem;
}
#cardprosumer {
  width: 610px;
  height: 100px;
  background-color: rgb(98, 98, 98);
  box-shadow: 2px 2px 2px 2px #232323;
  margin: 1rem 0rem 1rem 0rem;
  position: relative;
}
div#main {
  background-color: #393939;
  margin: 0rem 4rem 4.5rem 4rem;
  /* margin:2rem 2rem 1rem 2rem; */
}
#titlebox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#listtitle {
  /* margin:6.5rem 0rem 2.5rem 0rem; */
  display: flex;
  align-items: center;
}
#leftbox {
  float: left;
}
div#flexbox {
  background-color: #393939;

  /* margin:2rem 2rem 1rem 2rem; */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-between;
}
.iconimg {
  width: 3rem;
}
canvas{
  background-color: white;
  /* padding: 1rem 1rem 1rem 1rem; */
}
</style>
