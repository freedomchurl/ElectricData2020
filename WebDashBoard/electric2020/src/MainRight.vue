<template>
  <div id="rightmain">
    <div id="upperbox">
      <div id="prosumernum">{{prosumernum}}</div>
      <div id="prosumertitle">PROSUMER</div>
    </div>
    <div id="lowerbox" class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>No.</th>
            <th>생산량</th>
            <th>수요량</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prosumer,index) in prosumerdata" v-bind:key="index" id="table-list">
            <td>{{index+1}}</td>
            <td>
              <img v-bind:class="stateicon" v-bind:src="updownicon[prosumer.up_output]" />
              <span
                v-bind:style="statetext[prosumer.up_output]"
              >{{parseFloat(prosumer.output).toFixed(3)}}</span>
            </td>
            <td>
              <img v-bind:class="stateicon" v-bind:src="updownicon[prosumer.up_demand]" />
              <span
                v-bind:style="statetext[prosumer.up_demand]"
              >{{parseFloat(prosumer.demand).toFixed(3)}}</span>
            </td>
          </tr>
          <!-- <tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr>
          <tr>
            <td>Mary</td>
            <td>Moe</td>
            <td>mary@example.com</td>
          </tr>
          <tr>
            <td>July</td>
            <td>Dooley</td>
            <td>july@example.com</td>
          </tr>-->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { EventBus } from "./event-bus.js";

export default {
  data() {
    return {
      prosumernum: "",
      controller: "",
      prosumerdata: [],
      statetext: ["color:red", "color:black", "color:rgb(2,38,152)"],
      stateicon: "state-icon",
      updownicon: [
        require("../static/up_tri.png"),
        require("../static/no_change.png"),
        require("../static/down_tri.png"),
      ],
    };
  },
  methods: {
    getInterval() {
      //console.log('why!');
      var vm = this;
      axios
        .get("http://127.0.0.1:7272/prosumer/getmainside", {
          params: { usernum: vm.prosumernum },
        })
        .then((res) => {
          if (res.data.status == true) {
            // 여기서 모든 유저에 대한 정보를 가져오게 된다.
            let payload = res.data.payload;
            vm.prosumerdata = payload;
          }
        });
    },
  },
  mounted() {
    var vm = this;

    EventBus.$on("stop-live", function () {
      console.log("Why not stop");
      clearInterval(vm.controller);
    });
    axios.get("http://127.0.0.1:7272/prosumer/getnum").then((res) => {
      console.log(res.data);
      if (res.data.status == true) {
        //vm.prosumernum_data = res.data.payload;
        vm.prosumernum = res.data.payload.prosumernum;

        axios
          .get("http://127.0.0.1:7272/prosumer/getmainside", {
            params: { usernum: vm.prosumernum },
          })
          .then((res) => {
            if (res.data.status == true) {
              // 여기서 모든 유저에 대한 정보를 가져오게 된다.
              let payload = res.data.payload;
              vm.prosumerdata = payload;

              vm.controller = setInterval(vm.getInterval, 60000); // 30초 마다 반복
            }
          });
      }
    });
  },
};
</script>

<style scoped>
#prosumertitle {
  color: rgb(135, 192, 25);
  font-weight: bold;
  font-size: 1.5rem;
}
#prosumernum {
  font-size: 2.5rem;
  font-weight: bold;
}
.state-icon {
  width: 10%;
  height: auto;
  margin: 0.5rem 0.5rem 0.5rem 0.5rem;
}
#lowerbox {
  text-align: center;
  margin: 1rem 2rem 1rem 2rem;
  /* width: 30%; */
  width: 35vw;
  color: white;
  background-color: rgb(98, 98, 98);
  box-shadow: 2px 2px 2px 2px #232323;
}
#upperbox {
  text-align: center;
  margin: 5rem 2rem 2rem 2rem;
  /* width: 30%; */
  width: 35vw;
  background-color: rgb(98, 98, 98);
  box-shadow: 2px 2px 2px 2px #232323;
}
</style>