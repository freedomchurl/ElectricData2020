<template>
  <div id="back">
    <button
      v-on:click="clickmenu(index)"
      v-bind:class="menubutton"
      v-for="(menuname,index) in menulist"
      v-bind:key="index"
    >{{menuname}}</button>
  </div>
</template>

<script>
import { EventBus } from "./event-bus.js";
export default {
  data() {
    return {
      menulist: [
        "실시간 그래프",
        "프로슈머 리스트",
        "예측 그래프",
        "한국 전력",
        "한국 전력 거래소",
      ],
      menubutton: "menubutton",
      routemenu: ["/", "/prosumer", "/predict"],
      };
  },
  created() {
    var vm = this;
    //console.log("Clicked");
    EventBus.$on("prosumer-detail", function (index, inputdata) {
      //console.log("Event!!" + name);
      // console.log(inputdata);
      // console.log("1111");
      vm.$router
        .push({ name: "detailProsumer", params: { data: inputdata } })
        .catch(() => {});
    });

    EventBus.$on("live", function () {
      vm.$router.push('/').catch(()=>{});
      //vm.$router.push("/live").catch(() => {});
    });
  },
  methods: {
    clickmenu(index) {
      console.log("Push Menu");
      //this.clickedcolor[index] = "color:rgb(135, 192, 25)";
      if (index != 0) {
        // live 해제.
        EventBus.$emit("stop-live");
      }
      if (index == 4) {
        // '한국 전력 거래소' 일 경우
        window.location.href = "http://www.kpx.or.kr";
      } else if (index == 3) {
        // '한국 전력' 일 경우
        window.location.href = "http://home.kepco.co.kr";
      } else {
        this.$router.push(this.routemenu[index]).catch(() => {});
      }
    },
  },
};
</script>

<style scoped>
div#back {
  text-align: left;
  font-family: "Noto Sans KR", sans-serif;
  height: 3rem;
  padding: 0rem 0rem 0rem 1.5rem;
  margin: 1rem 1.5rem 2rem 1.5rem;
  background-color: rgb(98, 98, 98);
  display: flex;
  box-shadow: 2px 2px 2px 2px #232323;
  /* margin:1rem 0rem 5rem 0rem; */
}
button.menubutton {
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  outline: 0;
  color: rgb(57, 57, 57);
  font-size: 1.1rem;
  margin: 0rem 2rem 0rem 2rem;
  font-weight: bold;
  font-family: "Noto Sans KR", sans-serif;
}
.menubutton:hover {
  color: rgb(135, 192, 25);
}
</style>
