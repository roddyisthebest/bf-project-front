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
      <v-row justify="center" class="pb-11">
        <v-col cols="11">
          <pray-list v-for="pray in prays" :key="pray.id" :user="pray" />
        </v-col>
      </v-row>
    </template>
    <template v-slot:layout-subContent>
      <span>asd</span>
    </template>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../components/Layout.vue";
import PrayList from "../components/PrayList.vue";
import { prayApi } from "../api";
import User from "../types/user";
export default Vue.extend({
  data() {
    return { prays: [] as User[] };
  },
  components: {
    Layout,
    PrayList,
  },
  async created() {
    try {
      const { data } = await prayApi.getPrays();
      this.prays = data.meta;
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  },
});
</script>
