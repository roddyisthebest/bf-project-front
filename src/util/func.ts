import Vue from "vue";
import {} from "vue-router";

const vueInstance = new Vue();

export const manageError = (error: string) => {
  if (error == "401" || error == "403") {
    location.href = `/error/${error}`;
  } else {
    vueInstance.$router.push(`/error/${error}`);
  }
};
