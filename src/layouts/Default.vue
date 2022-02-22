<template>
  <v-app>
    <div class="d-flex justify-center h-screen" id="container">
      <div id="router-link" class="flex-8 px-3" v-if="!setSmall">
        <v-list rounded>
          <div class="logo">
            <v-img
              width="55px"
              :src="require(`../assets/logo/logo_transparent.png`)"
              class="pl-3"
            ></v-img>
          </div>
          <v-list-item-group
            v-model="selectedItem"
            color="primary"
            class="mt-80"
          >
            <v-list-item
              v-for="(item, i) in leftMenu"
              :key="i"
              @click="goPage(item.path)"
              :disabled="$route.path == item.path"
            >
              <v-list-item-icon>
                <v-icon v-text="item.meta.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-btn
            style="width: 100%"
            color="primary"
            class="px-4 py-6 mt-2"
            rounded
            depressed
            @click="setOverlay"
            >큐티 올리기</v-btn
          >
        </v-list>

        <user-info :myInfo="$store.state.user"></user-info>
      </div>

      <v-bottom-navigation
        v-model="value"
        background-color="primary"
        dark
        shift
        v-else
        style="z-index: 5"
        id="bottom"
      >
        <v-btn
          v-for="(item, i) in bottomMenu"
          :key="i"
          @click="goPage(item.path)"
        >
          <span>{{ item.name }}</span>

          <v-icon>{{ item.meta.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>

      <div id="contents" class="flex-1">
        <v-main class="content-wrapper">
          <transition name="slide-fade">
            <router-view
              ><template v-slot:user-info v-if="setSmall">
                <user-info
                  :myInfo="$store.state.user"
                  :isItSmall="setSmall"
                ></user-info>
              </template>
              <template v-slot:title-info>
                <span class="font-weight-black text-h6 px-4">{{
                  getTitle
                }}</span>
              </template>
            </router-view>
          </transition>
        </v-main>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import User from "../types/user";
import Route from "../types/route";

import router from "../router";
import userInfo from "../components/userInfo.vue";
import bus from "../util/bus";

import io from "socket.io-client";

export default Vue.extend({
  name: "App",

  data() {
    return {
      items: [] as Array<Route>,
      user: {} as User,
      selectedItem: 0,
      value: 0,
      socket: io("localhost:8001"),
    };
  },
  components: {
    userInfo,
  },
  beforeMount() {
    this.items = router.options.routes;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name == this.$route.name) {
        this.selectedItem = i;
        break;
      }
    }
  },

  async created() {
    this.user = this.$store.state.user;
    this.socket.on("feed-upload", (data) => {
      if (data != this.$store.state.user.id) {
        bus.$emit("set:more");
      }
    });
    if (
      this.$route.path.includes("user") &&
      parseInt(this.$route.params.id, 10) == this.$store.state.user.id
    ) {
      this.value = 1;
    } else if (this.$route.path.includes("pray")) {
      this.value = 2;
    } else if (this.$route.path.includes("penalty")) {
      this.value = 3;
    } else {
      if (!(this.$route.path == "/")) {
        this.value = null;
        console.log(this.value);
      }
    }
    bus.$on("delete:user", this.deleteUser);
  },
  methods: {
    goPage(link: string) {
      if (this.$route.path != link) {
        if (link.includes("user")) {
          if (this.$route.path != "/user/" + this.$store.state.user.id) {
            this.$router.push("/user/" + this.$store.state.user.id);
          }
        } else {
          this.$router.push(link);
        }
      }
      // console.log(this.selectedItem);
    },
    async logout() {
      try {
        await this.deleteUser();
      } catch (e) {
        console.log(e);
      }
    },
    login() {
      this.$router.push("/login");
    },
    click() {
      this.$refs.imageInput.click();
    },
    setOverlay() {
      bus.$emit("set:overlay");
    },
    async deleteUser() {
      await this.$store.dispatch("DELETE_USER");
      console.log("hey delete user bro");
    },
  },
  computed: {
    leftMenu(): Array<Route> {
      return this.items.filter((e) => e.meta.isMenu == true);
    },
    bottomMenu(): Array<Route> {
      return this.items.filter((e) => e.meta.bottom == true);
    },
    setSmall(): boolean {
      return this.$vuetify.breakpoint.smAndDown;
    },
    getTitle(): string {
      return this.$route.name;
    },
  },
  beforeDestroy() {
    bus.$off("delete:user", this.deleteUser);
  },
});
</script>

<style scoped>
.h-screen {
  width: 100%;
  height: 100%;
}
.flex-8 {
  flex: 2;
}
.flex-1 {
  flex: 8;
}
#router-link {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #f5f5f5;
}
.logo {
  position: absolute;
  width: 100%;
  top: 20px;
}
.mt-80 {
  margin-top: 75px;
}
#container {
  position: relative;
}
#bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

#tweet-button {
  position: absolute;
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
