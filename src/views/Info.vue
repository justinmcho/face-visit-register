<template>
  <div class="entire">
    <header>FACEVISIT 방문자 관리</header>
    <div>개인정보 입력</div>
    <div>이름</div>
    <input class="input" v-model="name" placeholder="이름" />
    <div>ex) JohnDoe</div>
    <input class = "input" v-model="phoneNumber" color: red placeholder="핸드폰
    번호 입력" />
    <p>Phone Number is: {{ phoneNumber }}</p>
    <div>
      <router-link :to="{ name: 'Capture', params: { name: name } }"
        >다음 단계로</router-link
      >
      <!-- <v-btn href="./capture">얼굴 등록하러 가기</v-btn> -->
    </div>
    <router-link :to="{ name: 'Home' }">초기화</router-link>
    <div class="facevisitLogo">
      <img
        :src="require('../assets/facevisit_logo_black.png')"
        alt="FACEVISIT"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      phoneNumber: "",
    };
  },
};
</script>

<style>
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
  padding: 10px 50px;
}
.facevisitLogo {
  flex: 1;
  align-self: center;
  justify-content: flex-end;
  justify-self: flex-end;
}
</style>