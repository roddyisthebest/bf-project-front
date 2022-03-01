import router from "../router/index";

export const manageError = (error: string) => {
  if (error == "401" || error == "403") {
    location.href = `/error/${error}`;
  } else {
    router.push(`/error/${error}`);
  }
};
