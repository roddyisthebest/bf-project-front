<template>
  <div class="mt-6" style="margin-bottom: 125px" v-if="loading">
    <v-row v-for="(item, index) in list" :key="index" justify="center">
      <v-col cols="11" class="px-2 py-0">
        <v-textarea
          auto-grow
          color="primary"
          rounded
          rows="1"
          v-model="item.content"
          outlined
          class="my-2"
          hide-details
          :readonly="!item.edit"
        >
          <template v-slot:append>
            <span>{{ item.weekend }}</span>
          </template></v-textarea
        ></v-col
      >
    </v-row>
    <v-row justify="center" class="mb-2">
      <v-col cols="12" class="d-flex justify-center">
        <div v-if="isThere">
          <v-btn color="primary" rounded @click="addList" v-if="!reLoading"
            >더보기</v-btn
          >
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>

        <v-alert v-else type="warning" dark class="mb-0">
          로드할 기도제목이 없습니다.
        </v-alert>
      </v-col>
    </v-row>
  </div>
  <div
    class="mt-6 d-flex justify-center pt-8"
    style="margin-bottom: 68px"
    v-else
  >
    <v-progress-circular
      indeterminate
      color="primary"
      :size="50"
      :width="5"
    ></v-progress-circular>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { prayApi } from "../api";
import { manageError } from "../util/func";

export default Vue.extend({
  data() {
    return {
      list: null,
      isThere: false,
      loading: false,
      reLoading: false,
    };
  },
  async created() {
    try {
      const { data } = await prayApi.getPraysByUserId(
        parseInt(this.$route.params.id, 10),
        0
      );
      this.loading = true;
      this.list = data.meta;
      if (this.list.length == 5) {
        this.isThere = true;
      }
    } catch (e) {
      const error = e.toString().substring(e.toString().length - 3);
      manageError(error);
    }
  },
  methods: {
    async addList() {
      try {
        this.reLoading = true;
        const { data } = await prayApi.getPraysByUserId(
          parseInt(this.$route.params.id, 10),
          this.list[this.list.length - 1].id
        );
        this.reLoading = false;

        if (data.meta.length != 5) {
          this.isThere = false;
        }
        this.list = [...this.list, ...data.meta];
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      }
    },
  },
});
</script>

<style scoped>
::v-deep .v-textarea textarea {
  margin: 10px 0;
  padding: 5px 0;
  height: 100%;
  min-height: 35px;
}
::v-deep .v-textarea .v-input__append-inner {
  margin: 20px 0;
}
</style>
