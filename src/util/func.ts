import Vue from "vue";

const vueInstance = new Vue();

export const manageError = (error: string) => {
  if (error == "401" || error == "403" || error == "500") {
    location.href = `/error/${error}`;
  } else {
    vueInstance.$router.push(`/error/${error}`);
  }
};
