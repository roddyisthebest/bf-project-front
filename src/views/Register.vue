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
      <span class="text-h5 font-weight-black">큰숲청년단 회원가입</span>
    </v-row>
    <v-row justify="center" class="">
      <v-col xs="auto" sm="6" md="3" lg="3" class="pb-0">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            label="ID"
            outlined
            single-line
            v-model="id"
            required
            :rules="rules"
          ></v-text-field>
          <v-text-field
            label="NAME"
            outlined
            single-line
            v-model="name"
            required
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            label="PW"
            type="password"
            outlined
            single-line
            v-model="pw"
            :rules="rules"
            required
          ></v-text-field>
          <v-text-field
            label="PW CHECK"
            type="password"
            outlined
            single-line
            v-model="pwCheck"
            required
            :rules="[pw === pwCheck || 'Password must match']"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="auto" sm="6" md="3" lg="3" class="mt-0 pt-0">
        <v-btn
          color="primary"
          width="100%"
          height="50px"
          depressed
          :disabled="!valid"
          @click="register"
          >REGISTER</v-btn
        >
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto" class="py-0">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </v-col>
    </v-row>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="dialogWrap"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar :color="dialogError ? 'primary' : 'error'" dark>{{
            dialogError ? "Successful Joining 🔥" : "Error"
          }}</v-toolbar>
          <v-card-text>
            <div class="text-h6 pa-12">
              {{
                dialogError
                  ? `${userName}님! 회원가입에 성공했습니다.`
                  : "This account is already registered ⚠️"
              }}
            </div>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn text @click="goToLogin">Login</v-btn>
            <v-btn text @click="dialog.value = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { userApi } from "../api";
export default Vue.extend({
  data: () => ({
    alignments: ["start", "center", "end"],
    valid: false,
    rules: [
      (v: string) => !!v || "값이 없습니다.",
      (v: string) =>
        (v && /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/.test(v)) ||
        "영문,숫자가 포함되어야 합니다. (8 ~ 16자)",
    ],
    nameRules: [
      (v: string) => !!v || "값이 없습니다.",
      (v: string) =>
        (v && v.length <= 8) || "실명을 입력해주세요. (8자리 이하)",
    ],

    id: "",
    pw: "",
    pwCheck: "",
    name: "",
    error: false,
    dialogWrap: false,
    dialogError: false,
    userName: "",
  }),
  methods: {
    async register() {
      console.log(this.id.length, this.pw.length, this.name.length);
      try {
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
          const { data } = await userApi.register(this.id, this.pw, this.name);
          this.dialogWrap = true;
          this.dialogError = true;
          this.userName = data.meta.name;
          console.log(data);
        }
      } catch (e) {
        if (e.toString().substring(e.toString().length - 3) == "403") {
          this.dialogWrap = true;
          this.dialogError = false;
        }
      }
    },
    goToLogin() {
      this.$router.push("/login");
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
</style>
