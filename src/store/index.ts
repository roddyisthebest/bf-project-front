import Vue from "vue";
import createPersistedState from "vuex-persistedstate";
import Vuex, { ActionContext } from "vuex";
import User from "../types/user";
import { userApi } from "../api";
Vue.use(Vuex);

interface State {
  user: User;
}

export default new Vuex.Store({
  state() {
    return {
      user: null,
    };
  },
  mutations: {
    CHANGE_NAME(state: State, name: string) {
      state.user = { ...state.user, name };
    },
    CHANGE_IMG(state: State, img: string) {
      state.user = { ...state.user, img };
    },
    SET_USER(state: State, user: User) {
      // state.user = user;
      state.user = user;
    },
    DELETE_USER(state: State, status: Record<string, unknown>) {
      console.log(status);
      state.user = null;
    },
  },
  actions: {
    async FETCH_USER({ commit }: ActionContext<State, State>) {
      try {
        const res = await userApi.getUser();
        console.log(res);
        commit("SET_USER", res.data);
        return res;
      } catch (e) {
        console.log(e);
      }
    },
    async DELETE_USER({ commit }: ActionContext<State, State>) {
      try {
        const { data: status } = await userApi.logout();
        commit("DELETE_USER", status);
      } catch (e) {
        console.log(e);
      }
    },
  },
  plugins: [createPersistedState()],
});
