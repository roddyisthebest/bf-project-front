<template>
  <div
    v-if="url && url.length"
    id="container"
    :style="`background-image:url(${
      del ? '' : 'http://localhost:8001'
    }${url} );  cursor:${del ? 'auto' : 'pointer'}`"
    @click="goImage"
  >
    <v-row>
      <v-col cols="auto">
        <v-btn
          v-if="del"
          color="white"
          fab
          @click="$emit('delete-image')"
          x-small
          ><v-icon>mdi mdi-close </v-icon></v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    url: {
      type: String,
      required: false,
    },
    del: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    goImage() {
      if (!this.del) {
        open("http://localhost:8001" + this.url);
      }
    },
  },
});
</script>

<style scoped>
#container {
  background-repeat: none;
  background-size: cover;
  background-position: center center;
  width: 100%;
  min-height: 300px;
  border-radius: 30px;
  cursor: pointer;
}
</style>
