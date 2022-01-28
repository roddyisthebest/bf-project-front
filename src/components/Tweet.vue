<template>
  <v-card
    class="mt-0 pb-0"
    max-height="100%"
    light
    tile
    outlined
    style="border-left: none; border-right: none; border-color: #f5f5f5"
  >
    <v-card-text>
      <v-row>
        <v-col cols="auto">
          <v-avatar class="mt-3"> <img :src="tweet.User.img" /> </v-avatar
        ></v-col>
        <v-col style="flex: 1" class="px-4">
          <v-row class="d-flex align-center pt-5">
            <span class="font-weight-black text-h6 pl-2">{{
              tweet.User.name
            }}</span>
            <span class="text-subtitle1 pl-2">@{{ tweet.User.provider }}</span>
            <span class="text-subtitle1 pl-2"
              >· {{ moment(tweet.updatedAt).fromNow() }}</span
            >
          </v-row>
          <v-textarea
            hide-details
            name="input-7-4"
            light
            class="mt-2"
            no-resize
            rows="3"
            readonly
            :value="tweet.content"
            v-if="tweet.content.length"
          >
          </v-textarea>
          <v-row class="pa-2 mt-6 mb-3">
            <image-preview :del="false" :url="tweet.img" />
          </v-row>
        </v-col>
      </v-row>
      <v-row
        justify="end"
        class="mt-0 mb-3"
        v-if="getMyInfo.id == tweet.User.id"
      >
        <v-col cols="auto" class="pa-1">
          <v-btn icon color="pink" @click="deleteTweet">
            <v-icon>mdi mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import ImagePreview from "./ImagePreview.vue";
import Tweet from "../types/tweet";
import moment from "moment";
import User from "../types/user";
import { postApi } from "../api";
import bus from "../util/bus";
export default Vue.extend({
  components: {
    ImagePreview,
  },
  props: {
    tweet: {} as PropType<Tweet>,
  },
  data() {
    return { moment };
  },
  computed: {
    getMyInfo(): User {
      return this.$store.state.user;
    },
  },
  methods: {
    async deleteTweet() {
      try {
        const { data } = await postApi.deleteTweet(this.tweet.id);
        bus.$emit("delete:tweet", this.tweet.id);
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>
