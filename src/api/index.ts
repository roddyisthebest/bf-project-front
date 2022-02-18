import axios, { AxiosResponse } from "axios";
import Data from "../types/data";
axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: "http://localhost:8001" as string,
});

export const userApi = {
  login: (userId: string, password: string): Promise<AxiosResponse<Data>> =>
    api.post("/user/login", { userId, password }),
  register: (
    userId: string,
    password: string,
    name: string
  ): Promise<AxiosResponse<Data>> =>
    api.post("/user/", { userId, password, name }),

  loginWithGoogle: (): Promise<AxiosResponse<string, unknown>> =>
    api.get("/auth/google"),
  getUser: (): Promise<AxiosResponse<string, unknown>> =>
    api.get("/user", { withCredentials: true }),

  logout: (): Promise<AxiosResponse<Data>> =>
    api.post("/user/logout", { withCredentials: true }),
  getUserById: (id: number): Promise<AxiosResponse<Data>> =>
    api.get(`/user/${id}`, { withCredentials: true }),
  setUserImg: (
    formData: FormData,
    type: string
  ): Promise<AxiosResponse<Data>> => {
    return api.post(`/user/img/${type}`, formData);
  },
  resetUserBack: (): Promise<AxiosResponse<Data>> =>
    api.post("/user/back/reset"),
  editUserProfile: (
    userId: string,
    pw: string,
    name: string
  ): Promise<AxiosResponse<Data>> => api.put("/user", { userId, pw, name }),
  follow: (id: string, isFollow: boolean): Promise<AxiosResponse<Data>> =>
    api.post("/user/follow", { id, isFollow }),
};

export const postApi = {
  postImage: (formData: FormData): Promise<AxiosResponse<Data>> => {
    return api.post("/post/img", formData);
  },
  deleteImage: (filePath: string): Promise<AxiosResponse<Data>> =>
    api.post("/post/img/delete", { filePath }),
  postTweet: (content: string, img: string): Promise<AxiosResponse<Data>> => {
    console.log(content);
    return api.post("/post/tweet", { content, img });
  },
  getTweets: (lastId: number): Promise<AxiosResponse<Data>> =>
    api.get(`/post/tweets/${lastId}`),
  getOwnTweets: (
    lastId: number,
    UserId: number
  ): Promise<AxiosResponse<Data>> =>
    api.get(`/post/tweets/${lastId}/${UserId}`),
  deleteTweet: (id: number): Promise<AxiosResponse<Data>> =>
    api.delete(`/post/tweet/delete/${id}`),
};

export const penaltyApi = {
  getPenaltys: (): Promise<AxiosResponse<Data>> =>
    api.get("/penalty", { withCredentials: true }),
  checkPaid: (id: number, payed: boolean): Promise<AxiosResponse<Data>> =>
    api.post("/penalty/check", { id, payed }, { withCredentials: true }),
  getRecordsByUserId: (UserId: number): Promise<AxiosResponse<Data>> =>
    api.get(`/penalty/${UserId}`),
};

export const prayApi = {
  getPrays: (): Promise<AxiosResponse<Data>> => api.get("/pray"),
  createPray: (UserId: number, content: string): Promise<AxiosResponse<Data>> =>
    api.post("/pray", { UserId, content }),
  updatePray: (id: number, content: string): Promise<AxiosResponse<Data>> =>
    api.put("pray", { id, content }),
  deletePray: (id: number): Promise<AxiosResponse<Data>> =>
    api.delete(`pray/${id}`),
  getPraysByUserId: (
    UserId: number,
    lastId: number
  ): Promise<AxiosResponse<Data>> => api.get(`pray/${UserId}/${lastId}`),
};
