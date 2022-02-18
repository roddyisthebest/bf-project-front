<template>
  <div>
    <v-overlay
      :value="overlay"
      :class="`align-start ${setSmall ? `my-overlay` : ``}`"
    >
      <v-card
        :class="setSmall ? '' : 'mt-7'"
        :min-width="setSmall ? `` : `700`"
        :height="setSmall ? `100%` : ``"
        style="border-radius: 30px"
        light
        :tile="setSmall"
        width="100%"
      >
        <v-card-title>
          <v-btn icon color="black" @click="reset">
            <v-icon>mdi mdi-close </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="auto">
              <v-avatar> <img :src="$store.state.user.img" /> </v-avatar
            ></v-col>
            <v-col style="flex: 1" class="py-0 px-4">
              <v-textarea
                hide-details
                name="input-7-4"
                label="사진 또는 글을 올려주세요."
                light
                class="mb-2"
                no-resize
                :rows="setSmall ? `6` : `3`"
                v-model="content"
              >
              </v-textarea>
              <v-row class="pa-2 mt-2" v-if="imagePreview">
                <image-preview
                  :url="url"
                  :del="true"
                  v-on:delete-image="deleteImage()"
                />
              </v-row>
              <v-row justify="space-between" class="my-4 px-2">
                <v-col cols="auto" class="pa-0">
                  <v-btn @click="click" icon color="primary" large>
                    <v-icon>mdi mdi-image</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="auto" class="pa-0 d-flex align-center">
                  <v-btn
                    depressed
                    color="primary"
                    rounded
                    @click="postTweet"
                    :disabled="content.length == 0 && url.length == 0"
                  >
                    올리기
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <input
          type="file"
          ref="imageInput"
          style="display: none"
          accept="image/*"
          @change="check"
        />
      </v-card>
    </v-overlay>
    <v-btn
      v-if="setSmall"
      class="mx-2"
      fab
      large
      color="primary"
      style="position: absolute; bottom: 80px; right: 10px"
      @click="overlay = !overlay"
    >
      <v-icon> mdi mdi-lead-pencil </v-icon>
    </v-btn>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogWrap"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar :color="dialogError ? 'primary' : 'error'" dark>{{
            dialogError ? "Successfully uploaded 🔥" : "Error"
          }}</v-toolbar>
          <v-card-text class="pa-5">
            <div
              class="text-subtitle-2 font-weight-bold pa-3"
              style="color: black"
            >
              {{
                dialogError
                  ? "업로드 성공하였습니다."
                  : "오늘 업로드된 게시글이 존재합니다. ⚠️"
              }}
            </div>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { postApi } from "../api";
import bus from "../util/bus";
import Vue from "vue";
import ImagePreview from "./ImagePreview.vue";
import io from "socket.io-client";

export default Vue.extend({
  data() {
    return {
      overlay: false,
      imagePreview: false,
      url: "",
      content: "",
      dialogWrap: false,
      dialogError: false,
      socket: io("localhost:8001"),
      formData: null as FormData,
    };
  },
  created() {
    bus.$on("set:overlay", this.setOverlay);
  },
  components: {
    ImagePreview,
  },
  computed: {
    setSmall(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  methods: {
    reset() {
      this.url = "";
      this.imagePreview = false;
      this.$refs.imageInput.value = "";
      this.overlay = false;
      this.content = "";
      this.formData = null;
    },
    check() {
      try {
        const formData = new FormData();
        formData.append("img", this.$refs.imageInput.files[0]);
        this.formData = formData;
        // const { data } = await postApi.postImage(formData);
        this.imagePreview = true;
        this.url = URL.createObjectURL(this.$refs.imageInput.files[0]);
      } catch (e) {
        console.log(e);
      }
    },
    async postTweet() {
      try {
        if (this.formData != null) {
          var { data: image } = await postApi.postImage(this.formData);
        }

        const { data } = await postApi.postTweet(
          this.content.length != 0 ? this.content : "",
          image ? image.meta : ""
        );
        if (data.code == 200) {
          this.reset();
          this.dialogWrap = true;
          this.dialogError = true;
          this.socket.emit("feed-upload", {
            id: this.$store.state.user.id,
          });
        }
        bus.$emit("get:tweets");
      } catch (e) {
        if (e.toString().substring(e.toString().length - 3) == "403") {
          this.reset();
          this.dialogWrap = true;
          this.dialogError = false;
        }
      }
    },
    click() {
      this.$refs.imageInput.click();
    },
    async deleteImage() {
      this.url = "";
      this.imagePreview = false;
      this.$refs.imageInput.value = "";
    },
    setOverlay() {
      this.overlay = !this.overlay;
    },
  },
  beforeDestroy() {
    bus.$off("set:overlay", this.setOverlay);
  },
});
</script>

<style scoped>
.my-overlay >>> .v-overlay__content {
  width: 100%;
  height: 100%;
}
</style>
