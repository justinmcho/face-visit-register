<template>
  <div class="entire">
    <div class="titleContainer">
      <header class="title">FACEVISIT 방문자 관리</header>
      <div class="title-description">사진 촬영</div>
      <div style="color: red">{{ errorMessage }}</div>
    </div>
    <div class="videoContainer">
      <div v-show="!savedImage">
        <video ref="video" autoplay playsinline class="video">
          Video stream not available.
        </video>
      </div>
      <div>
        <canvas ref="canvas"></canvas>
        <canvas
          id="canvas_crop"
          ref="canvas_crop"
          style="display: none"
        ></canvas>
      </div>
    </div>
    <div class="buttons-container">
      <v-btn size="large" color="#3B45FF" class="text-white" @click="capture()"
        >얼굴 등록</v-btn
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
import pico from "@/plugins/pico";
export default {
  name: "WebCamCapture",
  props: {
    value: {
      type: Boolean,
      required: true,
      default: true,
    },
    /**
     * emit events
     * input
     * capture
     */
  },
  data: function () {
    return {
      streaming: false,
      stream: null,
      face: { x: 0, y: 0, w: 0, h: 0 },
      savedImage: null,
      name: this.$route.params.name,
      phoneNumber: this.$route.params.phoneNumber,
      errorMessage: "",
    };
  },

  created() {
    this.supportOldBrowsers();
    this.name = this.$route.params.name;
  },
  mounted() {
    this.initialize();
  },
  beforeDestroy() {
    this.stopStream();
  },
  methods: {
    initialize() {
      console.log("@@", this.$refs);
      const dialogWidth = this.$refs.canvas.parentElement.clientWidth;
      if (dialogWidth < window.innerWidth) {
        this.$refs.canvas.style = `transform: translateX(-${
          (window.innerWidth - dialogWidth) / 2
        }px);`;
      }
      const config = {
        width: window.innerWidth,
        height: window.innerWidth,
        facingMode: "user",
      };
      console.log("WebCamCapture#initialize", config);
      navigator.mediaDevices
        .getUserMedia({ video: config, audio: false })
        .then((stream) => {
          console.log("WebCamCapture#initialize stream", stream, this.$refs);
          let video = this.$refs.video;
          let canvas = this.$refs.canvas;
          this.stream = stream;
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(stream);
          }
          video.onloadedmetadata = () => {
            console.log("WebCamCapture#initialize~onloadedmetadata");
            video.play();
          };
          video.addEventListener(
            "canplay",
            () => {
              console.log("WebCamCapture#initialize~canplay", this.streaming);
              if (!this.streaming) {
                canvas.setAttribute("width", video.videoWidth);
                canvas.setAttribute("height", video.videoHeight);
                this.streaming = true;
                this.initPicojs();
              }
            },
            false
          );
        })
        .catch((err) => {
          console.log("WebCamCapture#initialize err" + err);
          this.$store.commit("alertError", {
            component: this,
            error: err.toString(),
          });
        });
    },
    supportOldBrowsers() {
      console.log("WebCamCapture#supportOldBrowsers");
      // Older browsers might not implement mediaDevices at all, so we set an empty object first
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // Some browsers partially implement mediaDevices. We can't just assign an object
      // with getUserMedia as it would overwrite existing properties.
      // Here, we will just add the getUserMedia property if it's missing.
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // First get ahold of the legacy getUserMedia, if present
          let getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
    },
    initPicojs() {
      pico.download_face_detection_cascade((facefinderClassifyRegion) => {
        this.render(facefinderClassifyRegion);
      });
    },
    render(facefinderClassifyRegion) {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext("2d");
      let last = Date.now();
      let updateMemory = pico.instantiate_detection_memory(5);
      let loop = () => {
        // @FIXME value of 1 used to be 1000
        if (Date.now() - last < 1) {
          cancelAnimationFrame(this.requestAnimationFrameId);
          this.requestAnimationFrameId = requestAnimationFrame(loop);
          return;
        }
        last = Date.now();
        // For some effects, you might want to know how much time is passed
        // since the last frame; that's why we pass along a Delta time `dt`
        // variable (expressed in milliseconds)
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        let rgba = ctx.getImageData(
          0,
          0,
          video.videoWidth,
          video.videoHeight
        ).data;
        // prepare input to `run_cascade`
        let image = {
          pixels: rgba,
          nrows: video.videoHeight,
          ncols: video.videoWidth,
          ldim: video.videoWidth,
        };
        let params = {
          shiftfactor: 0.1, // move the detection window by 10% of its size
          minsize: 150, // minimum size of a face (not suitable for real-time detection, set it to 100 in that case)
          maxsize: 1000, // maximum size of a face
          scalefactor: 1.1, // for multiscale processing: resize the detection window by 10% when moving to the higher scale
        };
        // run the cascade over the image
        // dets is an array that contains (r, c, s, q) quadruplets
        // (representing row, column, scale and detection score)
        let dets = pico.run_cascade(image, facefinderClassifyRegion, params);
        dets = updateMemory(dets);
        dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2
        let qthresh = 50.0; // this constant is empirical: other cascades might require a different one(score)
        if (dets.length && dets[0][3] > qthresh) {
          const centerX = dets[0][1];
          const centerY = dets[0][0];
          const w = dets[0][2] + dets[0][2] / 3;
          const h = w + w / 3;
          const x = centerX - w / 2;
          const y = centerY - h / 2;
          this.face.x = x;
          this.face.y = y;
          this.face.w = w;
          this.face.h = h;
          ctx.beginPath();
          ctx.rect(x, y, w, h);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "blue";
          ctx.stroke();
        }
        cancelAnimationFrame(this.requestAnimationFrameId);
        this.requestAnimationFrameId = requestAnimationFrame(loop);
      };
      this.requestAnimationFrameId = requestAnimationFrame(loop);
    },
    cropImage(image, callback) {
      const face = this.face;
      let canvas_crop = this.$refs.canvas_crop;
      let img = new Image();
      img.onload = () => {
        canvas_crop.width = face.w;
        canvas_crop.height = face.h;
        var ctx = canvas_crop.getContext("2d");
        ctx.drawImage(
          img,
          face.x,
          face.y,
          face.w,
          face.h,
          0,
          0,
          face.w,
          face.h
        );
        let image = canvas_crop.toDataURL("image/jpeg");
        callback && callback(image);
        img = null;
      };
      img.src = image;
    },
    stopStream() {
      cancelAnimationFrame(this.requestAnimationFrameId);
      if (this.stream) {
        this.stream.stop && this.stream.stop();
        let tracks = this.stream.getTracks && this.stream.getTracks();
        console.log("WebCamCapture#stopStream", tracks);
        if (tracks && tracks.length) {
          tracks.forEach((track) => track.stop());
        }
        this.stream = null;
      }
    },

    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },

    capture() {
      let capturedImage = this.$refs.canvas.toDataURL("image/jpeg");
      this.savedImage = capturedImage;
      var message = "";
      var file = this.dataURLtoFile(capturedImage, "example.jpeg");

      let formdata = new FormData();
      formdata.append("image", file);

      const options = {
        method: "POST",
        body: formdata,
        headers: {
          uid: encodeURIComponent(this.name),
          "x-rapidapi-key":
            "8ef6747d69msh29f2c995e13af90p11ef82jsndb400bfdef04",
          "x-rapidapi-host": "alchera-face-authentication.p.rapidapi.com",
        },
      };

      fetch(
        "https://alchera-face-authentication.p.rapidapi.com/v1/face",
        options
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          message = json.result.message;
        })
        .finally(() => {
          if (message !== "OK") {
            this.errorMessage = message;
          } else {
            this.close();
            this.$router.push({
              name: "Confirmation",
              params: {
                name: this.name,
                phoneNumber: this.phoneNumber,
                savedImage: this.savedImage,
              },
            });
          }
          console.log(message);
        });

      // Uncomment below to use face recognition feature as well
      // this.cropImage(this.$refs.canvas.toDataURL("image/jpeg"), (image) => {
      //   this.$emit("input", false);
      //   const base64Image = image.split(",")[1];
      //   this.$emit("capture", base64Image);
      //   this.savedImage = base64Image;

      // });
    },
    close() {
      this.stopStream();
      this.$emit("input", false);
    },
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
.videoContainer {
  flex: 1;
  align-self: center;
  width: 100vw;
  height: 100vh;
  transform: scaleX(-1);
}

.video {
  display: none;
}

.buttons-container {
  padding: 10px 0;
}

.button-cancel {
  margin-right: 20px;
  background-color: #d8d9da !important;
  color: #484e60;
  border-radius: 4px;
}
.button-confirm {
  background-color: #3b77ff !important;
  color: #ffffff !important;
  border-radius: 4px;
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
