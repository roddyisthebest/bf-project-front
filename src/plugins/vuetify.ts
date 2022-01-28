import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#65D0D1",
        secondary: "#F5F5F5",
        accent: "#8c9eff",
        error: "#b71c1c",
      },
    },
  },
});
