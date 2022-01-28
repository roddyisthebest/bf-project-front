<template>
  <Layout />
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "./layouts/Layout.vue";
import moment from "moment";
export default Vue.extend({
  name: "App",
  components: { Layout },

  data() {
    return {};
  },
  created() {
    // console.log(
    //   moment("2022-02-05").week() - moment("2022-02-05").startOf("month").week()
    // );
    // var days = [
    //   "Sunday",
    //   "Monday",
    //   "Tuesday",
    //   "Wednesday",
    //   "Thursday",
    //   "Friday",
    //   "Saturday",
    // ];
    // console.log(days[moment(this.$store.state.user.createdAt).weekday()]);
  },
});
</script>
