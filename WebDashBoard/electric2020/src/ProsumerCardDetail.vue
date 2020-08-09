<template>
  <div id="main"> 
      <div id="titlebox">
          <div id="leftbox">
      <div id="listtitle">
        <img class="iconimg" v-bind:src="houseicon">
      <h2>{{this.$route.params.data.name}}</h2>
      <!-- {{this.$route.params.data.index + ' ' + this.$route.params.data.name}} -->
      </div>
      </div>
      <button id="modify" v-bind:class="modifybutton">정보 수정</button>
      </div>
      <!-- <div id="flexbox">
      <CardProsumer v-on:click.native="detailevent(index)" v-for="(menuname,index) in menulist" v-bind:key="index" id="cardprosumer"></CardProsumer>
      </div> -->

      <div class="detail-data">
          <div class="detail-card detail-card1">
            <h2 class="card-value">500kW</h2>
            <h4 class="card-name">월 평균 생산량</h4>
          </div>
          <div class="detail-card detail-card2">
            <h2 class="card-value">500kW</h2>
            <h4 class="card-name">월 평균 수요량</h4>
          </div>
          <div class="detail-card detail-card3">
            <h2 class="card-value">500kW</h2>
            <h4 class="card-name">월 평균 저장량</h4>
          </div>
      </div>
      <div class="detail-data">
          <div class="detail-card detail-card4">
            <h2 class="card-value">500kW</h2>
            <h4 class="card-name">월 평균 타운내 구매량</h4>
          </div>
          <div class="detail-card detail-card5">
            <h2 class="card-value">500kW</h2>
            <h4 class="card-name">월 평균 전력거래소 구매량</h4>
          </div>
          <div class="detail-card detail-card6">
            <h2 class="card-value">500kW</h2>
            <h4 class="card-name">월 평균 전력판매 판매량</h4>
          </div>
      </div>

    <!-- -->
    <div class="graph-area">
        <div class="graph-card">
            <div id="listtitle">
                <img class="iconimg" v-bind:src="houseicon">
                <h2 class="graph-title">전력 변화 추이</h2>
                <hr class="graph-line">
            </div>
        <!-- <div id="memo-content"></div> -->
        <canvas id="mainCanvas-1"></canvas>
        </div>

        <div class="graph-card">
            <div id="listtitle">
                <img class="iconimg" v-bind:src="houseicon">
                <h2 class="graph-title">전력 거래량</h2>
                <hr class="graph-line">
            </div>
        <canvas id="mainCanvas-2"></canvas>
        </div>
    </div>
    <!-- -->
    <div id="memo-card">
        <h2 class="memo-text">MEMO</h2>
        <div id="memo-content"></div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'


var chartd = {
  type:'line',
  data:{
    labels:['A','B','C'],
    datasets:[
      {
        label:'Test1',
        data:[3,4,5,4,2,1,2,3,2,1,2,3,4,2,3],
        backgroudColor:['rgba(54,73,93,.5)','rgba(54,73,93,.5)','rgba(54,73,93,.5)'],
        borderColor:['#36495d','#36495d','#36495d'],
        borderWidth:3
      }
    ]
  },
  options:{
    responsive:true,
    lineTension:1,
    scales:{
      yAxes:[{
        ticks:{
            beginAtZero:false,
            padding:25,
        }
      }

      ]
    }
  }
}

export default {
  methods: {
    createChart(charId,chartData){
      const ctx = document.getElementById(charId)
      
      new Chart(ctx,{
        type:chartData.type,
        data:chartData.data,
        options:chartData.options
      });
    }
  },
  data(){
    return {
      logo : require('../static/logo.png'),
      houseicon:require('../static/houseicon_active.png'),
      houseicon_d :require('../static/houseicon_deactive.png'),
      modifybutton:'timeclass btn btn-light btn-sm',
      linedata:chartd
    }
  },
  mounted() {
    this.createChart('mainCanvas-1',this.linedata)
    this.createChart('mainCanvas-2',this.linedata)
  },
}
</script>

<style scoped>
.graph-line{
    border-top:2px solid yellow;
    margin:0rem 0.5rem 0rem 0.5rem;
}
.graph-title{
    font-size: 1.5rem;
    margin:1rem 1rem 1rem 0rem;
}
.iconimg{
    margin:1rem 1rem 1rem 1rem;
}
.graph-area{
    display:flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.graph-card{
    width: 640px;
    height: 400px;
    background-color: rgb(98,98,98);
    padding: 0rem 0rem 0rem 0rem;
    margin: 0rem 0rem 1.5rem 0rem;
    box-shadow: 2px 2px 2px 2px #232323;
}
#memo-content{
    height: 200px;
}
.memo-text{
    margin: 1rem 0rem 1rem 1rem;
    padding: 2rem 0rem 1rem 1rem;
}
#memo-card{
    margin: 1rem 0rem 1rem 0rem;
    background-color: rgb(98,98,98);
    box-shadow: 2px 2px 2px 2px #232323;
}

.card-value{
    font-size: 3rem;
    height: 70%;
    /* color:rgb(51,51,51); */
    line-height: 126px;
}
.card-name{
    height: 30%;
    color:rgb(135, 191, 25);
    align-content: center;
}
.detail-card{
    background-color: rgb(98,98,98);
    width: 400px;
    text-align: center;
    height: 180px;
    margin: 1rem 0rem 1rem 0rem;
    box-shadow: 2px 2px 2px 2px #232323;
}
.detail-data{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    margin: 1rem 0rem 1rem 0rem;
}

#modify{
    margin:6.5rem 0rem 2.5rem 0rem;
    align-content: right;;
}
h2{
    color:rgb(224,224,224);
    font-weight: bold;
    margin:0rem 0 0 0.5rem;
  }
#cardprosumer{
    width: 610px;
    height: 100px;
    background-color: rgb(98,98,98);
    box-shadow: 2px 2px 2px 2px #232323;
    margin: 1rem 0rem 1rem 0rem;
    position:relative;
}
  div#main{
    background-color:#393939;
    margin:0rem 4rem 4.5rem 4rem;
    /* margin:2rem 2rem 1rem 2rem; */

  }
  #titlebox{
      display:flex;
      align-items: center;
      justify-content : space-between;
  }
  #listtitle{
      /* margin:6.5rem 0rem 2.5rem 0rem; */
      display:flex;
      align-items: center;
  }
  #leftbox{
      float:left;
  }
  div#flexbox{
    background-color:#393939;

    /* margin:2rem 2rem 1rem 2rem; */
    display:flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: space-between;
  }
  .iconimg{
      width:3rem;
  }
</style>
