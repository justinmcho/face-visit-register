<template>
  <div class="entire">
    <div class="titleContainer">
      <header class="title">FACEVISIT 방문자 관리</header>
      <div class="title-description">개인정보 입력</div>
    </div>
    <div class="inputs-container">
      <div>
        <div class="input-title">이름</div>
        <input
          :class="isValidName() ? 'input' : 'input-rejected'"
          :value="name"
          @input="changeName"
          @blur="nameBlur = true"
          placeholder="이름"
        />
        <div :class="isValidName() ? 'example' : 'example-rejected'">
          ex) 홍길동
        </div>
      </div>
      <div style="padding-top: 3vh">
        <div class="input-title">핸드폰 번호</div>
        <input
          :class="isValidPhoneNumber() ? 'input' : 'input-rejected'"
          @blur="phoneNumberBlur = true"
          v-model="phoneNumber"
          placeholder="핸드폰 번호 입력"
        />
        <div :class="isValidPhoneNumber() ? 'example' : 'example-rejected'">
          ex) 01012345678
        </div>
      </div>
    </div>
    <div class="buttons-container">
      <v-btn
        :disabled="!buttonControl()"
        size="large"
        color="#3B45FF"
        class="text-white"
        :to="{
          name: 'Capture',
          params: { name: name, phoneNumber: phoneNumber },
        }"
        >다음 단계로</v-btn
      >
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
  methods: {
    changeName(e) {
      this.name = e.target.value;
    },
    buttonControl() {
      if (
        (this.regexKorean.test(this.name) ||
          this.regexEnglish.test(this.name)) &&
        this.regexPhoneNumber.test(this.phoneNumber)
      ) {
        return true;
      } else {
        false;
      }
    },
    isValidName() {
      if (
        (this.regexKorean.test(this.name) ||
          this.regexEnglish.test(this.name)) &&
        this.nameBlur
      ) {
        return true;
      } else if (this.nameBlur) {
        return false;
      } else {
        return true;
      }
    },
    isValidPhoneNumber() {
      if (
        !this.regexPhoneNumber.test(this.phoneNumber) &&
        this.phoneNumberBlur
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    return {
      regexKorean: /^[가-힣]{2,4}$/,
      regexEnglish: /^[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/,
      regexPhoneNumber: /^\d{3}-?\d{4}-?\d{4}$/,
      name: "",
      nameBlur: false,
      phoneNumber: "",
      phoneNumberBlur: false,
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
.input-rejected {
  font-family: sans-serif;
  border: 3px solid red;
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
.inputs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input-title {
  font-weight: bold;
}
.example {
  font-size: 13px;
  color: #363636;
}
.example-rejected {
  font-size: 13px;
  color: red;
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