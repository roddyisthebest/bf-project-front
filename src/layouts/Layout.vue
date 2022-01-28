<template>
  <component id="container" :is="setLayout" />
</template>
<script lang="ts">
import Vue from "vue";
import Default from "./Default.vue";
import Empty from "./Empty.vue";

export default Vue.extend({
  data() {
    return { meta: "" };
  },
  components: { Default, Empty },
  computed: {
    setLayout(): string {
      return this.meta;
    },
  },
  created() {
    this.meta = this.$route.meta.layout;
    console.log(this.meta);
  },
});
</script>

<style scoped>
#container {
  position: fixed;
  overflow: hidden;
  width: 100%;
  height: 100vh;
}
</style>
