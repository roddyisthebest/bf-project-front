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
    SET_USER(state: State, user: User) {
      // state.user = user;
      state.user = user;
    },
    DELETE_USER(state: State, status: Record<string, unknown>) {
      if (status.code == 200) {
        state.user = null;
      }
    },
  },
  actions: {
    async FETCH_USER({ commit }: ActionContext<State, State>) {
      try {
        const res = await userApi.getUser();
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
