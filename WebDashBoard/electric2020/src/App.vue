<template>
  <div id="app">
    <div id="header">
      <img v-bind:src="logo">
      <h1>SMART ELECTRIC SYSTEM 2020 - Vaninside</h1>
    </div>
    <MenuComponent></MenuComponent>
    <!-- <MainComponent></MainComponent> -->
    <router-view></router-view>
  </div>
</template>

<script>
import MenuVue from './Menu'
//import MainVue from './Main.vue'

export default {
  name: 'App',
  data(){
    return {
      logo : require('../static/logo.png')
    }
  },
  components:{
    'MenuComponent':MenuVue,
    //'MainComponent':MainVue,
  }
}
</script>

<style>
  body{
    margin: 0%;
  }

  div#header{
    display:flex;
    text-align: left;
    vertical-align: middle;
    padding: 0rem 0rem 0rem 1.5rem;
    background-color: ivory;
  }
  img{
    display:left;
    width: 20%;
    height: 20%;
    padding : 1.5rem 0 1.5rem 0rem;
    vertical-align: middle;
  }
  h1{
    padding : 1.5rem 0rem 1.5rem 1rem;
    margin: 0%;
    font-size: 2rem;
    vertical-align: middle;
  }
</style>
