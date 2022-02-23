<template>
  <div id="container">
    <span style="text-align: center; font-size: 30px">로그인중...</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { manageError } from "../util/func";

export default Vue.extend({
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      try {
        const res = await this.$store.dispatch("FETCH_USER");

        if (res.status == 200) {
          location.href = "http://localhost:8080/";
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>

<style scoped>
#container {
  display: flex;
  height: 100vh;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}
</style>
