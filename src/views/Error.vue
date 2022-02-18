<template>
  <v-container fluid>
    <v-row justify="center" class="logo">
      <v-col cols="auto">
        <v-img
          width="100px"
          :src="require(`../assets/logo/logo_transparent.png`)"
        ></v-img>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-100">
      <span class="text-h5 font-weight-black"
        >{{ $route.params.type }} ERROR</span
      >
    </v-row>
    <v-row justify="center" class="mt-8">
      <span
        class="text-subtitle-1"
        style="color: light-gray; width: 90%; text-align: center"
        >{{ message }}</span
      >
    </v-row>
    <v-row justify="center" class="mt-8">
      <v-col cols="auto">
        <v-btn
          rounded
          color="primary"
          width="250px"
          @click="goHome"
          depressed
          class="pa-3"
          >Go home</v-btn
        >
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" class="pt-0">
        <v-btn
          rounded
          color="primary"
          width="250px"
          @click="$router.push('/login')"
          depressed
          outlined
          class="pa-3"
          >LOGIN</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      message: "",
    };
  },
  created() {
    if (this.$route.params.type == "403" || this.$route.params.type == "401") {
      this.message = "권한이 없습니다.";
    } else if (this.$route.params.type == "404") {
      this.message = "페이지가 존재하지 않습니다.";
    } else if (this.$route.params.type == "500") {
      this.message =
        "서버오류 입니다. 관리자에게 문의해주세요. \n010-5152-9445";
    }
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
});
</script>
<style scoped>
.logo {
  position: absolute;
  width: 100%;
}

.mt-100 {
  margin-top: 100px;
}
a {
  text-decoration: none;
  width: 100%;
  height: 100%;
}
</style>
