<template>
  <v-card class="overflow-hidden mb-3" color="white lighten-1">
    <v-toolbar flat color="primary">
      <router-link :to="`/user/${user.id}`">
        <v-avatar size="28px">
          <img :src="user.img" />
        </v-avatar>
        <span class="ml-2 black--text">{{ user.name }}</span>
      </router-link>

      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text class="px-5 py-7">
      <v-row v-for="(item, index) in list" :key="index">
        <v-col cols="12" class="px-2 py-0">
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
              <v-btn
                icon
                color="green"
                small
                v-if="item.edit"
                :loading="item.updateLoading"
                @click="updateItem(item.id, index)"
              >
                <v-icon small> mdi mdi-content-save </v-icon>
              </v-btn>
              <v-btn
                icon
                color="blue"
                small
                v-else
                @click="item.edit = !item.edit"
              >
                <v-icon small>mdi mdi-lead-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                color="red"
                small
                :loading="item.deleteLoading"
                @click="deleteItem(item.id, index)"
              >
                <v-icon small>mdi mdi-delete</v-icon>
              </v-btn>
            </template></v-textarea
          ></v-col
        >
      </v-row>
      <v-row justify="center">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn @click="addItem(user.id)" :loading="addLoading">
            추가하기
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
      Your profile has been updated
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import User from "../types/user";
import { prayApi } from "../api";
// import Pray from "../types/pray";
export default Vue.extend({
  props: {
    user: {} as PropType<User>,
  },
  data() {
    return {
      hasSaved: false,
      isEditing: null,
      list: [],
      addLoading: false,
    };
  },

  methods: {
    async addItem(UserId: number) {
      try {
        this.addLoading = true;
        const { data } = await prayApi.createPray(
          UserId,
          "새로운 기도제목 입니다."
        );
        this.list = [
          ...this.list,
          {
            content: "새로운 기도제목입니다.",
            edit: false,
            id: data.meta,
            deleteLoading: false,
            updateLoading: false,
          },
        ];
      } catch (e) {
        console.log(e);
      } finally {
        this.addLoading = false;
      }
    },
    async updateItem(id: number, index: number) {
      try {
        this.list.splice(index, 1, {
          ...this.list[index],
          updateLoading: true,
        });
        const { data } = await prayApi.updatePray(id, this.list[index].content);
        this.list.splice(index, 1, {
          ...this.list[index],
          updateLoading: false,
          edit: false,
        });
      } catch (e) {
        console.log(e);
      }
    },
    async deleteItem(id: number, index: number) {
      try {
        this.list.splice(index, 1, {
          ...this.list[index],
          deleteLoading: true,
        });
        const { data } = await prayApi.deletePray(id);
        this.list.splice(index, 1);
      } catch (e) {
        console.log(e);
      }
    },
  },

  created() {
    this.user.Prays.map((e) => {
      this.list = [
        ...this.list,
        { ...e, edit: false, deleteLoading: false, updateLoading: false },
      ];
    });
    this.list = this.list.filter((e) => e.content != "default");
    console.log(this.list);
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
  margin-top: 0;

  padding: 15px 0;
}
</style>
