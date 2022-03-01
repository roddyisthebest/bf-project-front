<template>
  <div class="mt-3" style="margin-bottom: 115px" v-if="loading">
    <v-row v-for="(tweet, index) in tweets" :key="index" class="mt-0">
      <v-col
        cols="12"
        class="py-0"
        transition="scroll-y-transition"
        style="position: relative"
      >
        <tweet
          :tweet="tweet"
          :isMyTweet="parseInt($route.params.id, 10) == $store.state.user.id"
        />
      </v-col>
    </v-row>
    <v-snackbar v-model="snackBar" :timeout="2000">
      Delete completed!
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackBar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-row justify="center" class="py-5">
      <v-col cols="auto" class="py-0" v-if="!isThereNothing">
        <v-btn color="primary" rounded @click="reloadTweets">더보기</v-btn>
      </v-col>
      <v-col cols="10" class="py-0" v-else>
        <v-alert type="warning" dark class="mb-0">
          최근 2주동안의 피드가 없습니다.
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
import { postApi } from "../api";
import TweetType from "../types/tweet";
import Tweet from "../components/Tweet.vue";
import bus from "../util/bus";
import { manageError } from "../util/func";

export default Vue.extend({
  data() {
    return {
      tweets: [] as Array<TweetType>,
      isThereNothing: false,
      loading: false,
      snackBar: false,
    };
  },
  components: {
    Tweet,
  },
  computed: {
    setSmall(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  watch: {
    $route() {
      this.getOwnTweets();
    },
  },
  async created() {
    console.log("im recreated!");
    await this.getOwnTweets();
    bus.$on("get:tweets", this.getOwnTweets);
    bus.$on("delete:tweet", this.removeTweet);
  },
  methods: {
    async reloadTweets() {
      try {
        const { data } = await postApi.getOwnTweets(
          this.tweets[this.tweets.length - 1].id,
          parseInt(this.$route.params.id, 10)
        );
        if (data.meta.length == 5) {
          this.isThereNothing = false;
        } else {
          this.isThereNothing = true;
        }
        this.tweets = [...this.tweets, ...data.meta];
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      }
    },

    async getOwnTweets() {
      try {
        this.loading = false;
        const { data } = await postApi.getOwnTweets(
          0,
          parseInt(this.$route.params.id, 10)
        );
        this.loading = true;
        this.tweets = data.meta;
        if (data.meta.length == 5) {
          this.isThereNothing = false;
        } else {
          this.isThereNothing = true;
        }
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      }
    },
    removeTweet(id: number) {
      this.snackBar = true;
      this.tweets = this.tweets.filter((e) => e.id != id);
    },
  },
  beforeDestroy() {
    bus.$off("delete:tweet", this.removeTweet);
    bus.$off("get:tweets", this.getOwnTweets);
  },
});
</script>
