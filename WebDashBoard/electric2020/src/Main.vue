<template>
  <div>
      <div>
          여기다가, 시간 버튼이랑 시간 기간을 지정할 수 있도록 범위 지정
          <button>1시간</button>
          <button>2시간</button>
          <button>1일</button>
      </div>
      <div>
          <h2>평균 전력 생산량</h2>
          <hr>
          <div>그래프 영역</div>
      </div>
      <div>
          <h2>평균 전력 수요량</h2>
          <hr>
          <div>그래프 영역</div>
      </div>
      <div>
          <h2>평균 전력 저장량</h2>
          <hr>
          <div>그래프 영역</div>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      logo : 3//require('../../../static/img/smartwatch.png')
    }
  }
}
</script>

<style scoped>

  div{
    background-color: yellow;
  }
  hr{
        border-top:2px solid;
        margin:0rem 0.5rem 0rem 0.5rem;
    }

</style>
