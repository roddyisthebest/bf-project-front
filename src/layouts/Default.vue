<template>
  <v-app>
    <div class="d-flex justify-center h-screen" id="container">
      <div id="router-link" class="flex-8 px-3" v-if="!setSmall">
        <v-list rounded>
          <div class="logo">
            <v-img
              width="55px"
              :src="require(`../assets/logo/logo_transparent.png`)"
              class="pl-3"
            ></v-img>
          </div>
          <v-list-item-group
            v-model="selectedItem"
            color="primary"
            class="mt-80"
          >
            <v-list-item
              v-for="(item, i) in leftMenu"
              :key="i"
              @click="goPage(item.path)"
              :disabled="$route.path == item.path"
            >
              <v-list-item-icon>
                <v-icon v-text="item.meta.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-btn
            style="width: 100%"
            color="primary"
            class="px-4 py-6 mt-2"
            rounded
            depressed
            @click="overlay = !overlay"
            >큐티 올리기</v-btn
          >
        </v-list>

        <user-info :myInfo="$store.state.user"></user-info>
      </div>

      <v-bottom-navigation
        v-model="value"
        background-color="primary"
        dark
        shift
        v-else
        style="z-index: 5"
        id="bottom"
      >
        <v-btn
          v-for="(item, i) in bottomMenu"
          :key="i"
          @click="goPage(item.path)"
        >
          <span>{{ item.name }}</span>

          <v-icon>{{ item.meta.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
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
      <div id="contents" class="flex-1">
        <v-main class="content-wrapper">
          <transition name="slide-fade">
            <router-view :isItSmall="setSmall"
              ><template v-slot:user-info v-if="setSmall">
                <user-info
                  :myInfo="$store.state.user"
                  :isItSmall="setSmall"
                ></user-info>
              </template>
              <template v-slot:title-info>
                <span class="font-weight-black text-h6 px-4">{{
                  getTitle
                }}</span>
              </template>
            </router-view>
          </transition>
        </v-main>
      </div>
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
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import User from "../types/user";
import Route from "../types/route";

import router from "../router";
import userInfo from "../components/userInfo.vue";
import ImagePreview from "../components/ImagePreview.vue";
import bus from "../util/bus";

import { postApi } from "../api";
import io from "socket.io-client";

export default Vue.extend({
  name: "App",

  data() {
    return {
      drawer: true,
      items: [] as Array<Route>,
      mini: true,
      user: {} as User,
      selectedItem: 0,
      overlay: false,
      imagePreview: false,
      url: "",
      value: 1,
      content: "",
      socket: io("localhost:8001"),
      dialogWrap: false,
      dialogError: false,
      formData: null as FormData,
    };
  },
  components: {
    userInfo,
    ImagePreview,
  },
  beforeMount() {
    this.items = router.options.routes;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name == this.$route.name) {
        this.selectedItem = i;
        break;
      }
    }
  },
  async created() {
    this.user = this.$store.state.user;
    this.socket.on("feed-upload", (data) => {
      if (data != this.$store.state.user.id) {
        bus.$emit("set:more");
      }
    });
  },
  methods: {
    goPage(link: string) {
      if (this.$route.path != link) {
        if (link.includes("user")) {
          this.$router.push("/user/" + this.$store.state.user.id);
        } else {
          this.$router.push(link);
        }
      }
      // console.log(this.selectedItem);
    },
    async logout() {
      try {
        await this.$store.dispatch("DELETE_USER");
        console.log(this.$store.state.userStore);
      } catch (e) {
        console.log(e);
      }
    },
    login() {
      this.$router.push("/login");
    },
    click() {
      this.$refs.imageInput.click();
    },

    async check() {
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
    async deleteImage() {
      // const { data } = await postApi.deleteImage(this.url);
      this.url = "";
      this.imagePreview = false;
      this.$refs.imageInput.value = "";
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
    reset() {
      this.url = "";
      this.imagePreview = false;
      this.$refs.imageInput.value = "";
      this.overlay = false;
      this.content = "";
      this.formData = null;
    },
  },
  computed: {
    leftMenu(): Array<Route> {
      return this.items.filter((e) => e.meta.isMenu == true);
    },
    bottomMenu(): Array<Route> {
      return this.items.filter((e) => e.meta.bottom == true);
    },
    setSmall(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
    getTitle(): string {
      return this.$route.name;
    },
  },
});
</script>

<style scoped>
.h-screen {
  width: 100%;
  height: 100%;
}
.flex-8 {
  flex: 2;
}
.flex-1 {
  flex: 8;
}
#router-link {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #f5f5f5;
}
.logo {
  position: absolute;
  width: 100%;
  top: 20px;
}
.mt-80 {
  margin-top: 75px;
}
#container {
  position: relative;
}
#bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

#tweet-button {
  position: absolute;
}

.my-overlay >>> .v-overlay__content {
  width: 100%;
  height: 100%;
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
