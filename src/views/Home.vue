<template>
  <Layout>
    <template v-slot:layout-content style="position: relative">
      <v-row id="title" justify="space-between">
        <v-col cols="auto">
          <slot name="title-info"></slot>
        </v-col>
        <v-col cols="auto">
          <slot name="user-info"> </slot>
        </v-col>
      </v-row>
      <transition name="fade">
        <v-row id="more" justify="center" class="ma-0" align="center"
          ><v-col cols="auto" class="pa-0">
            <v-btn v-if="more" rounded @click="roadNewTweet"
              >새 게시물 +{{ number }}</v-btn
            >
          </v-col>
        </v-row>
      </transition>
      <template v-if="tweets != null">
        <v-row v-if="!more" style="height: 30px"> </v-row>
        <v-row v-for="(tweet, index) in tweets" :key="index" class="mt-0">
          <v-col
            cols="12"
            class="py-0"
            transition="scroll-y-transition"
            style="position: relative"
          >
            <tweet :tweet="tweet" :isMyTweet="false" />
          </v-col>
        </v-row>
        <v-row
          justify="center"
          class="pt-5"
          :style="isItSmall ? `margin-bottom:140px` : `padding-bottom:20px`"
        >
          <v-col cols="auto" class="py-0" v-if="!isThereNothing">
            <v-btn color="primary" rounded @click="reloadTweets">더보기</v-btn>
          </v-col>
          <v-col cols="10" class="py-0" v-else>
            <v-alert type="warning" dark
              >최근 2주동안의 피드가 없습니다.</v-alert
            >
          </v-col>
        </v-row>
        <v-snackbar v-model="snackbar" :timeout="2000">
          Delete completed!
          <template v-slot:action="{ attrs }">
            <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
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
import Tweet from "../components/Tweet.vue";
import TweetType from "../types/tweet";
import { postApi } from "../api";
import bus from "../util/bus";
import Layout from "../components/Layout.vue";
import Upload from "../components/Upload.vue";
import Introduce from "../components/Introduce.vue";
import { manageError } from "../util/func";

export default Vue.extend({
  components: {
    Tweet,
    Layout,
    Upload,
    Introduce,
  },
  data() {
    return {
      tweets: null as Array<TweetType>,
      isThereNothing: false,
      more: false,
      number: 0,
      snackbar: false,
    };
  },

  async created() {
    try {
      this.getTweets();
      bus.$on("get:tweets", this.getTweets);
      bus.$on("set:more", this.setMore);

      bus.$on("delete:tweet", this.removeTweet);
    } catch (e) {
      const error = e.toString().substring(e.toString().length - 3);
      manageError(error);
    }
  },

  methods: {
    async reloadTweets() {
      try {
        const { data } = await postApi.getTweets(
          this.tweets[this.tweets.length - 1].id
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
    async getTweets() {
      try {
        const { data } = await postApi.getTweets(0);
        if (data.meta.length == 5) {
          this.isThereNothing = false;
        } else {
          this.isThereNothing = true;
        }

        this.more = false;
        this.number = 0;
        this.tweets = data.meta;
        bus.$emit("reload:tweets");
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      }
    },
    removeTweet(id: number) {
      this.tweets = this.tweets.filter((e) => e.id != id);
      this.snackbar = true;
    },
    setMore() {
      this.more = true;
      this.number = this.number + 1;
    },
    roadNewTweet() {
      this.getTweets();
    },
  },

  beforeDestroy() {
    bus.$off("delete:tweet", this.removeTweet);
    bus.$off("get:tweets", this.getTweets);
    bus.$off("set:more", this.setMore);
  },
  computed: {
    isItSmall() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#more {
  position: sticky;
  left: 0;
  top: 90px;
  width: 100%;
  z-index: 2;
}
</style>
