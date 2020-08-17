<template>
  <div id="main">
    <div id="listtitle">
      <h2>실시간 그래프</h2>
    </div>
    <div id="flexbox">
      <LiveCardProsumer
        v-bind:livedata="prosumerdata[index]"
        v-bind:prosumerdata="prosumerList[index]"
        v-for="(prosumer,index) in prosumerList"
        v-bind:key="index"
        id="cardprosumer"
      ></LiveCardProsumer>
    </div>
  </div>
</template>

<script>
import LivecardProsumer from "./LiveCard.vue";
import { EventBus } from "./event-bus.js";
import axios from "axios";

import IP from "../static/setting.json"

export default {
  components: {
    LiveCardProsumer: LivecardProsumer,
  },
  methods: {
    startInterval(seconds, callback) {
      callback();
      return setInterval(callback, seconds * 1000);
    },
    detailevent(index) {
      console.log("Clicked " + index);
      console.log("/prosumer" + "/" + index);
      var inputdata = this.prosumerList[index];
      EventBus.$emit("prosumer-detail", index, inputdata); // index를 넘겨준다.
    },
    getInterval() {
      //console.log('why!');
      var vm = this;
      IP.IP
      axios.get("http://" + IP.IP + ":7272/prosumer/getdetaillive").then((res) => {
        console.log(res);

        if (res.data.status == true) {
          var respond = res.data.payload;
          vm.prosumerdata = respond;
          EventBus.$emit("live"); // index를 넘겨준다.
        }
      });
    },
  },
  data() {
    return {
      timelist: ["1시간", "2시간", "3시간", "6시간", "1일"],
      timebutton: "timeclass btn btn-light btn-sm",
      menulist: ["1", "2", "3", "4", "5", "6"],
      prosumerdata: [],
      prosumerList: [],
      controller: null,
      // prosumerList: [
      //   { index: 0, name: "PROSUMER01" },
      //   { index: 1, name: "PROSUMER02" },
      //   { index: 2, name: "PROSUMER08" },
      //   { index: 3, name: "PROSUMER09" },
      // ], // 이걸, axios로 가져와야 한다.
    };
  },
  mounted() {
    const vm = this;
    EventBus.$on("stop-live", function () {
      console.log("Why not stop");
      clearInterval(vm.controller);
    });
    console.log("Mouted");

    axios.get("http://" + IP.IP + ":7272/prosumer/all").then((res) => {
      console.log(res.data);
      if (res.data.status == true) {
        vm.prosumerList = res.data.payload;
        vm.getInterval();
        //vm.controller = vm.startInterval(vm.getInterval(),30);
        vm.controller = setInterval(vm.getInterval, 30000); // 30초 마다 반복
      }
    });
  },
  // beforeRouteEnter (to, from, next) {
  //   console.log(to + ' ' + from + ' ' + next + ' '+ 'RouteEnter');
  // }
};
</script>

<style scoped>
h2 {
  color: rgb(224, 224, 224);
  font-weight: bold;
  margin: 5rem 0 0 0;
}
#cardprosumer {
  width: 610px;
  /* height: 400px; */
  background-color: rgb(98, 98, 98);
  box-shadow: 2px 2px 2px 2px #232323;
  margin: 1rem 0rem 1rem 0rem;
  position: relative;
}
div#main {
  background-color: #393939;
  margin: 4rem 4rem 4.5rem 4rem;
  /* margin:2rem 2rem 1rem 2rem; */
}
#listtitle {
  margin: 6.5rem 0rem 2.5rem 0rem;
}
div#flexbox {
  background-color: #393939;

  /* margin:2rem 2rem 1rem 2rem; */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-between;
}
</style>
