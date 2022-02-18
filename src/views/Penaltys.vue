<template>
  <div class="mt-6" style="margin-bottom: 68px" v-if="penaltys != null">
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="overflow-hidden mb-3" color="white lighten-1">
          <v-toolbar flat color="primary">
            <span class="ml-2 black--text font-weight-bold">평균/총액</span>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <span class="ml-2 black--text font-weight-light"
              >{{ average }}/{{ fee }}</span
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
            outlined
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div
    v-else
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

<script lang="ts">
import Vue from "vue";
import Penalty from "../types/penalty";
import { penaltyApi } from "../api";
export default Vue.extend({
  data() {
    return {
      headers: [
        {
          text: "벌금",
          align: "start",
          value: "paper",
        },
        { text: "날짜", value: "weekend" },
      ],
      penaltys: null as Penalty[],
      fee: 0,
      average: 0,
    };
  },
  computed: {
    isItSmall(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  async created() {
    try {
      const { data } = await penaltyApi.getRecordsByUserId(
        parseInt(this.$route.params.id, 10)
      );

      data.meta.map((penalty: Penalty) => {
        this.fee += penalty.paper;
      });
      this.average = this.fee / data.meta.length;
      this.penaltys = data.meta;
    } catch (e) {
      console.log(e);
    }
  },
});
</script>
