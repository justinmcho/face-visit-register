<template>
  <div class="entire">
    <img
      class="backgroundImage"
      :src="require('../assets/main_bg_pattern2.png')"
      alt="Background"
    />
    <div class="textContainer">
      <div class="titleContainer">
        <header class="title">Welcome</header>
      </div>
      <div class="description">
        Alignment Day 신청을 위해
        <br />
        아래 신청하기 버튼을 눌러주세요.
      </div>
      <div class="registerButton">
        <v-btn size="large" class="text-blue-darken-3" to="./info"
          >신청하기</v-btn
        >
      </div>
      <div class="facevisitLogo">
        <img
          :src="require('../assets/facevisit_logo_white.png')"
          alt="FACEVISIT"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.entire {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
.backgroundImage {
  height: 100vh;
  width: 100vw;
  background-color: #3b45ff !important;
  position: absolute;
  z-index: 0;
}
.textContainer {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  z-index: 1;
}
.titleContainer {
  flex: 1;
  align-self: center;
  justify-self: flex-end;
  padding-top: 15vh;
}
.title {
  font-weight: bold;
  font-size: 20px;
  color: white;
}
.description {
  flex: 1;
  align-items: center;
  align-self: center;
  justify-content: center;
  color: white;
  text-align: center;
}
.registerButton {
  flex: 1;
  align-self: center;
}
.facevisitLogo {
  flex: 1;
  align-self: center;
  justify-content: flex-end;
  justify-self: flex-end;
}
</style>