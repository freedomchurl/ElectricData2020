<template>
  <div id="app">
    <div id="header">
      <img id="logo" v-bind:src="logo" v-on:click="gotomain">
      <h1 id="title">SMART ELECTRIC SYSTEM <span id="subtitle">2020 - Vaninside</span></h1>
    </div>
    <MenuComponent></MenuComponent>
    <!-- <MainComponent></MainComponent> -->
    <router-view></router-view>
    <footer id="footer">
      <div id="footerdiv">
      <img id="insta" v-bind:src="instalogo">
      <img id="email" v-bind:src="emaillogo">
      <h3>2020 Vaninside, All rights reserved</h3>
      </div>
    </footer>
  </div>
</template>

<script>
import MenuVue from './Menu'
//import MainVue from './Main.vue'
export default {
  name: 'App',
  data(){
    return {
      logo : require('../static/logo.png'),
      instalogo:require('../static/instalogo.png'),
      emaillogo:require('../static/emaillogo.png')
    }
  },
  components:{
    'MenuComponent':MenuVue,
    //'MainComponent':MainVue,
  },
  methods:{
    gotomain(){
      this.$router.push('/').catch(()=>{});
    }
  }
}
</script>

<style>
#subtitle{
  font-size:1.5rem;
}
  body{
    margin: 0%;
    background-color: #393939;
  }

  div#header{
    display:flex;
    text-align: left;
    vertical-align: middle;
    padding: 3rem 0rem 0rem 1.5rem;
    background-color: #393939;
  }
  img#logo{
    display:left;
    width: 10%;
    height: 10%;
    padding : 1.5rem 0 1.5rem 0rem;
    vertical-align: middle;
  }
  h1#title{
    padding : 1.5rem 0rem 1.5rem 1rem;
    margin: 0%;
    font-size: 2.3rem;
    color:rgb(224,224,224);
    vertical-align: middle;
    font-weight: 900;
    font-family: 'Noto Sans KR', sans-serif;
  }
  #footer{
    text-align: center;
    background-color:rgb(98,98,98);
    height: 12rem;
    position:relative;
    vertical-align: middle;
  }
  div#footerdiv{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  h3{
    color:rgb(135,192,25);
    font-size: 1.1rem;
    font-family: 'Noto Sans KR', sans-serif;
  }
  #insta{
    width:2rem;
    height:2rem;
    margin:0 0.3rem 0.5rem 0;
  }
  #email{
    width:2.5rem;
    height:2.5rem;
    margin:0 0 0.5rem 0.3rem;
  }
</style>
