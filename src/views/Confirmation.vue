<template>
  <div class="entire">
    <div class="titleContainer">
      <header class="title">FACEVISIT 방문자 관리</header>
      <div class="title-description">등록이 완료되었습니다.</div>
    </div>
    <div class="id-container">
      <img
        style="
          transform: scaleX(-1);
          width: 50vw;
          height: 50vw;
          margin-left: 5vw;
          margin-right: 5vw;
        "
        :src="savedImage"
        alt="등록된 얼굴 이미지"
      />
      <div>
        <div>
          <div class="id-title">이름</div>
          <div class="id-value">
            {{ name }}
          </div>
        </div>
        <div class="id-component-container">
          <div class="id-title">핸드폰 번호</div>
          <div class="id-value">
            {{ phoneNumber }}
          </div>
        </div>
      </div>
    </div>
    <div class="buttons-container">
      <router-link
        style="
          text-decoration: none;
          color: #363636;
          border: 0px;
          border-bottom-width: 2px;
          border-bottom-color: #363636;
          border-style: solid;
          padding-top: 1vh;
        "
        :to="{ name: 'Home' }"
        >처음으로</router-link
      >
      <div class="facevisitLogo">
        <img
          :src="require('../assets/facevisit_logo_black.png')"
          alt="FACEVISIT"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: this.$route.params.name,
      phoneNumber: this.$route.params.phoneNumber,
      savedImage: this.$route.params.savedImage,
    };
  },
};
</script>

<style scoped>
.entire {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7 !important;
}
.input {
  font-family: sans-serif;
  border: 3px solid #a3a8bf;
  border-radius: 5px;
  padding: 10px 20px;
  height: 40px;
  width: 60vw;
}
.titleContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.title {
  color: #3b45ff;
  font-weight: bold;
}
.title-description {
  color: black;
  font-weight: 700;
}
.id-container {
  flex: 1;
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.id-component-container {
  margin-top: 3vh;
}
.id-title {
  font-size: 14px;
  color: #686868;
}
.buttons-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.facevisitLogo {
  padding-top: 5vh;
}
</style>