<template>
  <div id="main">
      <div id="listtitle">
      <h2>프로슈머 리스트</h2>
      </div>
      <div id="flexbox">
      <CardProsumer v-for="(menuname,index) in menulist" v-bind:key="index" id="cardprosumer"></CardProsumer>
      </div>
  </div>
</template>

<script>
import cardProsumer from './ProsumerCard.vue'
export default {
components:{
    'CardProsumer':cardProsumer
},
  methods: {
    
  },
  data(){
    return {
      timelist:['1시간','2시간','3시간','6시간','1일'],
      timebutton:'timeclass btn btn-light btn-sm',
      menulist:['1','2','3','4','5','6']
    }
  },
  mounted() {

  },
}
</script>

<style scoped>
  
h2{
    color:rgb(224,224,224);
    font-weight: bold;
    margin:5rem 0 0 0;
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
    margin:4rem 4rem 4.5rem 4rem;
    /* margin:2rem 2rem 1rem 2rem; */

  }
  #listtitle{
      margin:6.5rem 0rem 2.5rem 0rem;
  }
  div#flexbox{
    background-color:#393939;

    /* margin:2rem 2rem 1rem 2rem; */
    display:flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: space-between;
  }
</style>
