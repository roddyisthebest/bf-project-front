<template v-once>
  <Layout>
    <template v-slot:layout-content>
      <v-row id="title" justify="space-between">
        <v-col cols="auto">
          <slot name="title-info"></slot>
        </v-col>
        <v-col cols="auto">
          <slot name="user-info"> </slot>
        </v-col>
      </v-row>
      <template v-if="user != null">
        <template v-if="!fromUsertoUser">
          <v-row justify="center">
            <v-col cols="12">
              <div
                id="background"
                :style="
                  user.background.length == 0
                    ? `background-image:url(${user.background})`
                    : `background-image:url(http://localhost:8001${user.background})`
                "
              >
                <v-avatar
                  width="85px"
                  height="85px"
                  id="img"
                  style="border: 4px solid white"
                >
                  <img :src="user.img" alt="user's img" />
                </v-avatar>
              </div>
            </v-col>
          </v-row>
          <v-row justify="end" class="mt-0">
            <v-col cols="auto" v-if="checkUser">
              <v-btn
                rounded
                color="#cfd9de"
                outlined
                class="mx-3"
                @click="setEditImg"
              >
                <span class="black--text font-weight-bold">프로필수정</span>
              </v-btn>
            </v-col>
            <v-col cols="auto" class="mr-2" v-else>
              <v-btn
                rounded
                dark
                :color="isItFollow ? `#cfd9de` : `black`"
                :outlined="isItFollow"
                class="mx-3"
                @click="follow"
                :loading="followLoading"
              >
                <span
                  :class="
                    isItFollow ? `black--text ` : `white--text font-weight-bold`
                  "
                  >{{ isItFollow ? `following` : `follow` }}</span
                >
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="px-8" style="flex-direction: column">
            <v-col cols="auto" class="pa-0">
              <span class="black--text font-weight-black text-h6">{{
                parseInt($route.params.id, 10) == $store.state.user.id
                  ? $store.state.user.name
                  : user.name
              }}</span>
            </v-col>
            <v-col cols="auto" class="pa-0">
              <span class="text font-weight-regular text-subtitle-2"
                >@{{ user.provider }}</span
              >
            </v-col>
            <v-col cols="auto" class="pa-0 mt-1">
              <v-icon small>mdi mdi-calendar</v-icon>
              <span class="text font-weight-regular text-subtitle-2 ml-1"
                >Joined {{ moment(user.createdAt).format("MMMM") }}
                {{ moment(user.createdAt).format("YYYY") }}</span
              >
            </v-col>
          </v-row>
          <v-row class="px-8">
            <v-col cols="auto" class="px-0 py-1">
              <span class="text-black font-weight-black text-subtitle-2 ml-1">{{
                user.Followings && user.Followings.length
              }}</span>
              <span class="text font-weight-regular text-subtitle-2 ml-1"
                >Following</span
              >
            </v-col>
            <v-col cols="auto" class="px-0 ml-2 py-1">
              <span class="text-black font-weight-black text-subtitle-2 ml-1">{{
                follower
              }}</span>
              <span class="text font-weight-regular text-subtitle-2 ml-1"
                >Followers</span
              >
            </v-col>
          </v-row>
          <v-row class="px-8" style="border-bottom: 1px solid #f5f5f5">
            <v-col
              cols="4"
              class="d-flex justify-center align-center py-0 px-0 route"
              style="height: 60px; position: relative"
              @click="goPage('/')"
            >
              <div
                :class="
                  !checkNowRoute.includes(`prays`) &&
                  !checkNowRoute.includes(`penaltys`)
                    ? `font-weight-bold`
                    : `font-weight-regular`
                "
              >
                매일성경
              </div>
              <div
                class="nowRoute"
                v-if="
                  !checkNowRoute.includes(`prays`) &&
                  !checkNowRoute.includes(`penaltys`)
                "
              ></div>
            </v-col>
            <v-col
              cols="4"
              class="d-flex justify-center align-center py-0 px-0 route"
              style="height: 60px; position: relative"
              @click="goPage('/prays')"
            >
              <div
                :class="
                  checkNowRoute.includes(`prays`)
                    ? `font-weight-bold`
                    : `font-weight-regular`
                "
              >
                기도제목
              </div>
              <div
                class="nowRoute"
                v-if="checkNowRoute.includes(`prays`)"
              ></div>
            </v-col>
            <v-col
              cols="4"
              class="d-flex justify-center align-center py-0 px-0 route"
              style="height: 60px; position: relative"
              @click="goPage('/penaltys')"
            >
              <div
                :class="
                  checkNowRoute.includes(`penaltys`)
                    ? `font-weight-bold`
                    : `font-weight-regular`
                "
              >
                벌금
              </div>
              <div
                class="nowRoute"
                v-if="checkNowRoute.includes(`penaltys`)"
              ></div>
            </v-col>
          </v-row>
          <v-overlay :value="overlayImg" class="my-overlay" style="z-index: 6">
            <v-card
              :class="setSmall ? '' : 'mt-7'"
              :min-height="setSmall ? `100%` : `600px`"
              style="border-radius: 30px; display: flex; flex-direction: column"
              light
              :tile="setSmall"
              :width="setSmall ? `100%` : `50%`"
            >
              <v-card-title :class="setSmall ? `` : `mx-4`">
                <v-row justify="space-between" align="center">
                  <v-col cols="auto" class="d-flex align-center"
                    ><v-btn
                      icon
                      color="black"
                      @click="
                        overlayImg = !overlayImg;
                        $refs.img.value = '';
                        formDataBack = null;
                        formDataUser = null;
                      "
                    >
                      <v-icon>mdi mdi-arrow-left </v-icon>
                    </v-btn>
                    <span class="ml-3 black--text text-h6 font-weight-black"
                      >사진 설정</span
                    >
                  </v-col>
                  <v-col cols="auto">
                    <v-btn
                      small
                      color="black"
                      dark
                      rounded
                      @click="
                        overlayImg = !overlayImg;
                        $refs.img.value = '';
                      "
                      >Apply</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-title>

              <v-row
                justify="center"
                class="mx-0 mb-7"
                style="width: 100%; flex: 1"
              >
                <v-col
                  cols="12"
                  class="px-0 d-flex align-center justify-center"
                  style="min-height: 100%"
                >
                  <cropper
                    class="cropper"
                    :src="url"
                    :stencil-props="{
                      aspectRatio: ratio[0] / ratio[1],
                    }"
                    @change="change"
                  ></cropper>
                </v-col>
              </v-row>
            </v-card>
          </v-overlay>
          <v-overlay :value="overlayEdit" class="my-overlay">
            <v-card
              :class="setSmall ? '' : 'mt-7'"
              :min-height="setSmall ? `100%` : `600px`"
              style="border-radius: 30px"
              light
              :tile="setSmall"
              :width="setSmall ? `100%` : `50%`"
            >
              <v-card-title :class="setSmall ? `` : `mx-4`">
                <v-row justify="space-between" align="center">
                  <v-col cols="auto" class="d-flex align-center"
                    ><v-btn
                      icon
                      color="black"
                      @click="overlayEdit = !overlayEdit"
                    >
                      <v-icon>mdi mdi-close </v-icon>
                    </v-btn>
                    <span class="ml-3 black--text text-h6 font-weight-black"
                      >프로필 수정</span
                    >
                  </v-col>
                  <v-col cols="auto">
                    <v-btn
                      small
                      color="black"
                      :disabled="name.length == 0"
                      dark
                      rounded
                      @click="saveProfile"
                      :loading="saveloading"
                      >Save</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-title>

              <v-row justify="center" class="mx-0 mb-7" style="width: 100%">
                <v-col cols="12" class="px-0">
                  <div
                    id="background"
                    :style="`background-image:url(${backImg})`"
                  >
                    <v-avatar
                      width="85px"
                      height="85px"
                      style="left: 33px"
                      id="img"
                    >
                      <div
                        :style="`background-image:` + `url(${userImg})`"
                        id="img-set"
                      >
                        <v-btn
                          class="mx-2"
                          fab
                          small
                          color="black"
                          dark
                          style="opacity: 0.6"
                          @click="
                            $refs.img.click();
                            ratio = [1, 1];
                            isBack = false;
                          "
                        >
                          <v-icon dark small>mdi mdi-camera-enhance </v-icon>
                        </v-btn>
                      </div>
                    </v-avatar>
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      color="black"
                      dark
                      style="opacity: 0.6"
                      @click="
                        $refs.img.click();
                        ratio = [37.4, 15];
                        isBack = true;
                      "
                    >
                      <v-icon dark small>mdi mdi-camera-enhance </v-icon>
                    </v-btn>
                    <v-btn
                      class="mx-2"
                      fab
                      small
                      color="black"
                      dark
                      style="opacity: 0.6"
                      @click="backImg = ''"
                      v-if="backImg.length != 0"
                    >
                      <v-icon dark small>mdi mdi-close </v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="10" class="px-0 pt-5 pb-0">
                  <v-text-field
                    label="NAME"
                    outlined
                    dense
                    maxlength="5"
                    hide-details
                    v-model="name"
                  ></v-text-field
                ></v-col>
              </v-row>
            </v-card>
            <input
              type="file"
              ref="img"
              style="display: none"
              accept=" .jpg, .jpeg"
              @change="createImg"
            />
          </v-overlay>
          <router-view></router-view>
        </template>
        <template v-else>
          <div
            class="d-flex"
            style="
              flex: 1;
              width: 100%;
              height: 90vh;
              align-items: center;
              justify-content: center;
            "
          >
            <v-img
              width="35px"
              :src="require(`../assets/logo/logo_transparent.png`)"
            ></v-img>
          </div>
        </template>
      </template>
      <template v-else>
        <div
          class="mt-6 d-flex justify-center pt-8"
          style="margin-bottom: 68px"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            :size="70"
            :width="7"
          ></v-progress-circular>
        </div>
      </template>
    </template>

    <template v-slot:layout-subContent>
      <v-row class="mt-2" justify="center">
        <v-col cols="auto"> <introduce /> </v-col>
      </v-row>
    </template>
    <template v-slot:upload>
      <upload />
    </template>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../components/Layout.vue";
import { userApi } from "../api";
import User from "../types/user";
import moment from "moment";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import Upload from "../components/Upload.vue";
import Introduce from "../components/Introduce.vue";

import { manageError } from "../util/func";

export default Vue.extend({
  data() {
    return {
      user: null as User,
      moment,
      overlayEdit: false,
      overlayImg: false,
      Cropper,
      userImg: "",
      backImg: "",
      url: "",
      ratio: [],
      isBack: false,
      formDataBack: {} as FormData,
      formDataUser: {} as FormData,
      name: "",
      isItFollow: false,
      follower: null as number,
      fromUsertoUser: false,
      saveloading: false,
      followLoading: false,
    };
  },
  components: {
    Layout,
    Upload,
    Introduce,
  },
  async created() {
    await this.setUserInfo();
    this.isItFollow = this.user.Followers.some(
      (user: User) => user.id == parseInt(this.$store.state.user.id, 10)
    );
    this.follower = this.user.Followers.length;
  },
  async beforeUpdate() {
    console.log("im update one");
  },
  computed: {
    checkUser() {
      return this.$route.params.id == this.$store.state.user.id;
    },
    checkNowRoute() {
      return this.$route.path;
    },
    setSmall(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  watch: {
    "$route.params.id": {
      handler: async function () {
        this.fromUsertoUser = true;
        await this.setUserInfo();
        this.fromUsertoUser = false;
      },
    },
  },
  methods: {
    goPage(link: string) {
      this.$route.path != "/user/" + this.$route.params.id + link &&
        this.$router.push("/user/" + this.$route.params.id + link);
    },
    change({ canvas }: any) {
      if (this.isBack) {
        this.backImg = canvas.toDataURL("image/png");
        this.setFormData(this.backImg, true);
      } else {
        this.userImg = canvas.toDataURL("image/png");
        this.setFormData(this.userImg, false);
      }
    },
    createImg() {
      try {
        this.url = URL.createObjectURL(this.$refs.img.files[0]);
        this.overlayImg = !this.overlayImg;
        console.log(this.ratio);
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      }
    },
    async saveProfile() {
      try {
        this.saveloading = true;
        if (
          !this.backImg.includes("http://localhost:8001/") &&
          this.backImg.length != 0
        ) {
          const { data } = await userApi.setUserImg(
            this.formDataBack,
            "background"
          );
          this.user = { ...this.user, background: data.meta };
        }
        if (this.backImg.length == 0) {
          await userApi.resetUserBack();
          this.user = { ...this.user, background: "" };
        }

        if (
          !(
            this.userImg.includes("http://localhost:8001/") ||
            this.userImg.includes("kakao") ||
            this.userImg.includes("https")
          )
        ) {
          const { data } = await userApi.setUserImg(this.formDataUser, "user");
          this.user = { ...this.user, img: data.meta };
          this.$store.commit("CHANGE_IMG", data.meta);
        }
        if (this.name !== this.$store.state.user.name) {
          try {
            const { data } = await userApi.editUserProfile(
              undefined,
              undefined,
              this.name
            );
            this.$store.commit("CHANGE_NAME", data.meta);
          } catch (e) {
            console.log(e);
          }
        }
        this.overlayEdit = false;
        this.formDataBack = null;
        this.formDataUser = null;
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      } finally {
        this.saveloading = false;
      }
    },
    setFormData(url: string, isBack: boolean) {
      var blobBin = atob(url.split(",")[1]); // base64 데이터 디코딩
      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      var file = new Blob([new Uint8Array(array)], { type: "image/png" }); // Blob 생성
      var formdata = new FormData(); // formData 생성
      if (isBack) {
        formdata.append("img", file);
        this.formDataBack = formdata;
      } else {
        formdata.append("img", file);
        this.formDataUser = formdata;
      }
    },
    setEditImg() {
      this.overlayEdit = true;
      this.userImg = this.user.img;
      if (this.user.background != "") {
        this.backImg = "http://localhost:8001" + this.user.background;
      } else {
        this.backImg = "";
      }
    },

    async setUserInfo() {
      try {
        const { data } = await userApi.getUserById(
          parseInt(this.$route.params.id, 10)
        );
        this.user = data.meta;
        this.userImg = this.user.img;
        if (this.user.background != "") {
          this.backImg = "http://localhost:8001" + this.user.background;
        }
        this.name = this.$store.state.user.name;
        console.log("setData");
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      }
    },
    async follow() {
      try {
        this.followLoading = true;
        const { data } = await userApi.follow(
          this.$route.params.id,
          !this.isItFollow
        );
        this.isItFollow = !this.isItFollow;
        if (this.isItFollow) {
          this.follower += 1;
        } else {
          this.follower -= 1;
        }
        console.log(data);
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      } finally {
        this.followLoading = false;
      }
    },
  },
});
</script>

<style scoped>
#background {
  background-repeat: none;
  background-size: cover;
  background-position: center center;
  width: 100%;
  min-height: 150px;
  background-color: rgb(207, 217, 222);
  /* padding: 15px;
  display: flex;
  align-items: flex-end; */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
#img {
  position: absolute;
  left: 15px;
  top: 107.5px;
}
#img-set {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid white;
  background-repeat: none;
  background-size: cover;
  background-position: center center;
  border-radius: 100%;
}

.text {
  color: rgb(83, 100, 113);
}

.route {
  transition: all 500ms ease-in;
  cursor: pointer;
}
/* .route:hover {
  background-color: #f5f5f5;
} */
.nowRoute {
  width: 80%;
  height: 4px;
  border-radius: 30px;
  background-color: #65d0d1;
  position: absolute;
  bottom: 0;
}

.my-overlay >>> .v-overlay__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cropper {
  height: 300px;
  width: 100%;
  background: #ddd;
}
</style>
