<template>
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
      <v-row justify="center">
        <v-col cols="12">
          <div id="background">
            <v-avatar width="85px" height="85px" id="img">
              <img
                style="border: 3px solid white"
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
              />
            </v-avatar>
          </div>
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-0">
        <v-col cols="auto" v-if="checkUser">
          <v-btn rounded color="#cfd9de" outlined class="mx-3">
            <span class="black--text font-weight-bold">edit</span>
          </v-btn>
        </v-col>
        <v-col cols="auto" class="mr-2" v-else>
          <v-btn rounded color="#cfd9de" outlined class="mx-3">
            <span class="black--text font-weight-bold">follow</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="px-8" style="flex-direction: column">
        <v-col cols="auto" class="pa-0">
          <span class="black--text font-weight-black text-h6">배성연</span>
        </v-col>
        <v-col cols="auto" class="pa-0">
          <span class="text font-weight-regular text-subtitle-2">@kakao</span>
        </v-col>
        <v-col cols="auto" class="pa-0 mt-1">
          <v-icon small>mdi mdi-calendar</v-icon>
          <span class="text font-weight-regular text-subtitle-2 ml-1"
            >Joined January 2022</span
          >
        </v-col>
      </v-row>
      <v-row class="px-8">
        <v-col cols="auto" class="px-0 py-1">
          <span class="text-black font-weight-black text-subtitle-2 ml-1"
            >1</span
          >
          <span class="text font-weight-regular text-subtitle-2 ml-1"
            >Following</span
          >
        </v-col>
        <v-col cols="auto" class="px-0 ml-2 py-1">
          <span class="text-black font-weight-black text-subtitle-2 ml-1"
            >22</span
          >
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
          <div>매일성경</div>
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
          <div>기도제목</div>
          <div class="nowRoute" v-if="checkNowRoute.includes(`prays`)"></div>
        </v-col>
        <v-col
          cols="4"
          class="d-flex justify-center align-center py-0 px-0 route"
          style="height: 60px; position: relative"
          @click="goPage('/penaltys')"
        >
          <div>벌금</div>
          <div class="nowRoute" v-if="checkNowRoute.includes(`penaltys`)"></div>
        </v-col>
      </v-row>
      <router-view></router-view>
    </template>
    <template v-slot:layout-subContent>
      <span>asd</span>
    </template>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../components/Layout.vue";
import { userApi } from "../api";
export default Vue.extend({
  components: {
    Layout,
  },
  async created() {
    try {
      const { data } = await userApi.getUserById(
        parseInt(this.$route.params.id, 10)
      );
    } catch (e) {
      console.log(e);
    }
  },
  computed: {
    checkUser() {
      return this.$route.params.id == this.$store.state.user.id;
    },
    checkNowRoute() {
      return this.$route.path;
    },
  },
  methods: {
    goPage(link: string) {
      this.$route.path != "/user/" + this.$store.state.user.id + link &&
        this.$router.push("/user/" + this.$store.state.user.id + link);
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
  min-height: 120px;
  background-color: rgb(207, 217, 222);
  /* padding: 15px;
  display: flex;
  align-items: flex-end; */
  position: relative;
}
#img {
  position: absolute;
  left: 15px;
  top: 77.5px;
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
</style>
