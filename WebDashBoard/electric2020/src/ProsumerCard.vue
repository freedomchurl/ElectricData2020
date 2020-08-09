<template>
  <div id="main">   
      <div id="innermain">
      <img class="iconimg" v-bind:src="houseicon">
      <h2>PROSUMER 01</h2>
      </div>
  </div>
</template>

<script>

export default {
  methods: {
    
  },
  data(){
    return {
      timelist:['1시간','2시간','3시간','6시간','1일'],
      timebutton:'timeclass btn btn-light btn-sm',
      houseicon:require('../static/houseicon_active.png'),
      houseicon_d :require('../static/houseicon_deactive.png')
    }
  },
  mounted() {

  },
}
</script>

<style scoped>
    .iconimg{
        width: 15%;
        display: left;
        margin:0rem 1rem 0rem 1rem;
    }

    #main{
        display:flex;
        flex-direction: column;
        background-color: rgb(98,98,98);
        box-shadow: 2px 2px 2px 2px #232323;
    
    }
    #innermain{
        display: flex;
    position: absolute;
    top: 50%;
    left: 35%;
    transform: translate(-50%, -50%);
    align-content: center;
    }
    h2{
        text-align: center;
        margin: 0;
        align-content: center;
        display:initial;
        color:rgb(224,224,224);
    
    }
</style>
