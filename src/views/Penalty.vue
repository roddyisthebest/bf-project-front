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

      <template v-if="!loading">
        <v-row
          :style="isItSmall ? `margin-bottom:116px` : `padding-bottom:20px`"
          justify="center"
        >
          <v-col cols="10">
            <v-card outlined>
              <v-data-table
                hide-default-footer
                :headers="headers"
                :items="penaltys"
                :search="search"
                :hide-default-header="false"
                outlined
              >
                <template v-slot:[`item.User`]="{ item }">
                  <router-link :to="`/user/${item.UserId}`">
                    <v-avatar size="28px">
                      <img :src="item.User.img" />
                    </v-avatar>
                    <span class="ml-2 black--text">{{ item.User.name }}</span>
                  </router-link>
                </template>
                <template v-slot:[`item.payed`]="{ item, index }">
                  <v-btn
                    fab
                    x-small
                    readOnly
                    icon
                    :loading="item.loading"
                    :color="item.payed ? 'success' : 'red'"
                    @click="setPaid(index, item.id)"
                    v-if="amIAdmin"
                  >
                    <v-icon icon>{{
                      item.payed ? "mdi mdi-check" : "mdi mdi-close"
                    }}</v-icon>
                  </v-btn>
                  <v-icon icon v-else :color="item.payed ? 'success' : 'red'">{{
                    item.payed ? "mdi mdi-check" : "mdi mdi-close"
                  }}</v-icon>
                </template>
              </v-data-table>
            </v-card>
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
      <v-row class="mt-2" justify="center">
        <v-col cols="auto"> <introduce /> </v-col>
      </v-row>
    </template>
    <template v-slot:upload>
      <upload />
    </template>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "../components/Layout.vue";
import { penaltyApi } from "../api";
import Penalty from "../types/penalty";
import Upload from "../components/Upload.vue";
import Introduce from "../components/Introduce.vue";

import { manageError } from "../util/func";

export default Vue.extend({
  components: {
    Layout,
    Upload,
    Introduce,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "유저",
          align: "start",
          filterable: false,
          value: "User",
        },
        { text: "벌금", value: "paper" },
        { text: "Paid", value: "payed" },
      ],
      penaltys: [] as Penalty[],
      loading: false,
    };
  },
  async created() {
    try {
      this.loading = true;
      const { data } = await penaltyApi.getPenaltys();
      data.meta.map((penalty: Penalty) => {
        this.penaltys = [...this.penaltys, { ...penalty, loading: false }];
      });
      this.loading = false;
    } catch (e) {
      const error = e.toString().substring(e.toString().length - 3);
      manageError(error);
    }
  },
  computed: {
    isItSmall(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
    amIAdmin(): boolean {
      return this.$store.state.user.admin;
    },
  },
  methods: {
    async setPaid(id: number, penaltyId: number) {
      try {
        this.penaltys.splice(id, 1, {
          ...this.penaltys[id],
          loading: !this.penaltys[id].loading,
        });
        const { data } = await penaltyApi.checkPaid(
          penaltyId,
          !this.penaltys[id].payed
        );
        this.penaltys.splice(id, 1, {
          ...this.penaltys[id],
          payed: !this.penaltys[id].payed,
          loading: !this.penaltys[id].loading,
        });
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      }
    },
  },
});
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
