<template>
  <div id="main">
      <div id="timezone">
          <button v-bind:class="timebutton" v-for="(time,index) in timelist" v-bind:key="index">{{time}}</button>
      </div>
      <div>
          <h2>실시간 전력 생산량</h2>
          <hr>
          <div>그래프 영역</div>
      </div>
      <div>
          <h2>실시간 전력 수요량</h2>
          <hr>
          <div>그래프 영역</div>
      </div>
      <div>
          <h2>실시간 전력 저장량</h2>
          <hr>
          <div>그래프 영역</div>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      timelist:['1시간','2시간','3시간','6시간','1일'],
      timebutton:'timeclass btn btn-light btn-sm'
    }
  }
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

</style>
