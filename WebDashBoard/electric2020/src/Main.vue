<template>
  <div id="main">
      <div id="timezone">
          <button v-bind:class="timebutton" v-for="(time,index) in timelist" v-bind:key="index">{{time}}</button>
      </div>
      <div class="canvasframe">
          <h2>실시간 전력 생산량</h2>
       
          <canvas id="mainCanvas">
          </canvas>
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
      timelist:['1시간','2시간','3시간','6시간','1일'],
      timebutton:'timeclass btn btn-light btn-sm',
      linedata:chartd,
    }
  },
  mounted() {
    this.createChart('mainCanvas',this.linedata)
    this.createChart('mainCanvas2',this.linedata)
    this.createChart('mainCanvas3',this.linedata)
  },
}
</script>

<style scoped>
  h2{
    color:rgb(224,224,224);
    font-weight: bold;
  }
  div#main{
    background-color:#393939;
    margin:0rem 2rem 0.5rem 2rem;
  }
  hr{
        border-top:2px solid;
        margin:0rem 0.5rem 0rem 0.5rem;
    }

  div#timezone{
    display:flex;
    justify-content: flex-end;
  }
  .timeclass{
    width: 5rem;
    margin: 3px;
  }
  canvas{
    height: 80%;
    margin: 1rem 1rem 1rem 1rem;
    background-color: rgb(224,224,224);
  }
  .canvasframe{
    margin:2rem 2rem 1rem 2rem;
  }

</style>
