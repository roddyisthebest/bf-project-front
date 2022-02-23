<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    top
    offset-y
    rounded="xl"
    width="30px"
  >
    <template v-slot:activator="{ on, attrs }">
      <!-- <v-btn
          color="indigo"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Menu as Popover
        </v-btn> -->
      <div
        id="container"
        :class="isItSmall ? `pr-3 mb-0` : `py-2 px-3 mb-3`"
        v-bind="attrs"
        v-on="on"
      >
        <v-avatar size="36px">
          <img :src="myInfo.img" alt="myInfo-img" />
        </v-avatar>
        <div
          class="px-2 d-flex justify-space-between align-item-center h-screen"
          v-if="!isItSmall"
        >
          <div>
            <span class="font-weight-bold">{{ myInfo.name }} </span>
            <span>님</span>
            <p class="ma-0 pa-0 font-weight-light sm_font">
              @{{ myInfo.provider }}
            </p>
          </div>
          <v-icon> mdi mdi-dots-horizontal </v-icon>
        </div>
      </div>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img :src="myInfo.img" alt="myInfo-img" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              ><span class="font-weight-bold">{{ myInfo.name }} </span>
              <span>님</span></v-list-item-title
            >
            <v-list-item-subtitle
              ><p class="ma-0 pa-0 font-weight-light sm_font">
                @{{ myInfo.provider }}
              </p></v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-action>
            <v-btn class="green--text" icon>
              <v-icon>mdi mdi-check</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link @click="logout">
          <v-list-item-title>로그아웃</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import MyInfo from "../types/myInfo";
import { manageError } from "../util/func";

export default Vue.extend({
  props: {
    myInfo: {} as PropType<MyInfo>,
    isItSmall: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      fav: true,
      menu: false,
      message: false,
      hints: true,
    };
  },
  methods: {
    async logout() {
      try {
        const res = await this.$store.dispatch("DELETE_USER");
        location.href = "http://localhost:8080/login";
      } catch (e) {
        const error = e.toString().substring(e.toString().length - 3);
        manageError(error);
      }
    },
  },
});
</script>

<style scoped>
#container {
  border-radius: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
#container:hover {
  background-color: #f5f5f5;
  transition: all 250ms ease;
}
.sm_font {
  font-size: 5px;
}

.h-screen {
  width: 100%;
}
</style>
