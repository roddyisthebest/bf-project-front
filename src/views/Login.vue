<template>
  <v-container fluid class="">
    <v-row justify="center" class="logo">
      <v-col cols="auto">
        <router-link to="/">
          <v-img
            width="100px"
            :src="require(`../assets/logo/logo_transparent.png`)"
          ></v-img>
        </router-link>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-100">
      <span class="text-h5 font-weight-black">큰숲청년단 로그인</span>
    </v-row>
    <v-row justify="center">
      <v-col xs="auto" sm="6" md="3" lg="3">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            label="ID"
            outlined
            single-line
            hide-details
            class="mb-4"
            v-model="id"
            :rules="rules"
          ></v-text-field>
          <v-text-field
            label="PW"
            type="password"
            outlined
            single-line
            hide-details
            v-model="pw"
            :rules="rules"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="auto" sm="6" md="3" lg="3">
        <v-btn
          color="primary"
          width="100%"
          height="50px"
          depressed
          @click="login(id, pw)"
          >LOGIN</v-btn
        >
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="auto" sm="6" md="3" lg="3" class="pt-0">
        <v-btn width="100%" height="50px" depressed>
          <a class="color-black" :href="loginUrl.google">GOOGLE</a>
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="auto" sm="6" md="3" lg="3" class="pt-0">
        <v-btn width="100%" height="50px" color="yellow" depressed>
          <a class="color-black" :href="loginUrl.kakao">KAKAO</a>
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto" class="py-0">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="2000">
      {{
        errorType == "401"
          ? `등록된 계정이 아닙니다.`
          : `${errorType} 오류 입니다 `
      }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { userApi } from "../api";
export default Vue.extend({
  data: () => ({
    alignments: ["start", "center", "end"],
    valid: false,
    rules: [(v: string) => !!v || "id & pw must be less than 1 characters"],
    id: "",
    pw: "",
    error: false,
    loginUrl: {
      google: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.VUE_APP_CLIENT_ID_GOOGLE}&&redirect_uri=${process.env.VUE_APP_CALLBACK_URL_GOOGLE}&scope=profile&response_type=code&accessType=online&prompt=consent`,
      kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_CLIENT_ID_KAKAO_ID}&redirect_uri=${process.env.VUE_APP_CALLBACK_URL_KAKAO}&response_type=code`,
    },
    snackbar: false,
    errorType: "",
  }),
  methods: {
    async login(id: string, pw: string) {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        try {
          const data = await userApi.login(id, pw);
          if (data.status == 200) {
            this.getUser();
          }
        } catch (e) {
          this.errorType = e.toString().substring(e.toString().length - 3);
          this.snackbar = true;
        }
      }
    },
    async getUser() {
      try {
        const res = await this.$store.dispatch("FETCH_USER");

        if (res.status == 200) {
          location.href = "http://localhost:8080/";
        }
      } catch (e) {
        this.errorType = e.toString().substring(e.toString().length - 3);
        this.snackbar = true;
      }
    },
  },
});
</script>

<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #d1d5db;
}
a {
  text-decoration: none;
  color: white;
  width: 100%;
}

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

a:hover {
  transition: all 300ms ease;
  color: black;
}

.color-black {
  color: black;
}
</style>
