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
      <template v-if="prays != null">
        <v-row justify="center" class="pb-11">
          <v-col cols="11">
            <pray-list v-for="pray in prays" :key="pray.id" :user="pray" />
          </v-col>
        </v-row>
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
      <span>asd</span>
    </template>
    <template v-slot:upload>
      <upload />
    </template>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../components/Layout.vue";
import PrayList from "../components/PrayList.vue";
import { prayApi } from "../api";
import User from "../types/user";
import Upload from "../components/Upload.vue";
import { manageError } from "../util/func";

export default Vue.extend({
  data() {
    return { prays: null as User[] };
  },
  components: {
    Layout,
    PrayList,
    Upload,
  },
  async created() {
    try {
      const { data } = await prayApi.getPrays();
      this.prays = data.meta;
    } catch (e) {
      const error = e.toString().substring(e.toString().length - 3);
      manageError(error);
    }
  },
});
</script>
