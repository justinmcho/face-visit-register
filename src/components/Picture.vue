<template>
  <div class="picture">
    <canvas></canvas>
  </div>
</template>

<script>
export default {
  name: "picture",
};
</script>

<style>
.picture {
  display: block;
  width: 100vw;
  height: 100vh;
  padding: 25px;
  box-sizing: border-box;
}
canvas {
  display: block;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}
</style>