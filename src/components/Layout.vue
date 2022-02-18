<template lang="">
  <div class="wrapper">
    <div class="flex-7">
      <slot name="layout-content"> </slot>
    </div>
    <div class="flex-3" v-if="!isItSmall">
      <slot name="layout-subContent"></slot>
    </div>
    <slot name="upload"></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import bus from "../util/bus";
export default Vue.extend({
  computed: {
    isItSmall() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  created() {
    bus.$on("get:tweets", this.goUp);
    bus.$on("reload:tweets", this.goUp);
  },
  methods: {
    goUp() {
      this.$vuetify.goTo(0, { container: ".flex-7" });
    },
  },
  beforeDestroy() {
    bus.$off("get:tweets", this.goUp);
    bus.$off("reload:tweets", this.goUp);
  },
});
</script>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  height: 100vh;
  position: relative;
}
.flex-7 {
  flex: 6;
  width: 100%;
  height: 100%;
  border-right: 1px solid #f5f5f5;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
}
.flex-3 {
  flex: 4;
  width: 100%;
  height: 100%;
}
#title {
  position: sticky;
  z-index: 2;
  top: 0;
  background-color: rgba(255, 255, 255, 0.85);
  /* backdrop-filter: blur(2px); */
}
</style>
