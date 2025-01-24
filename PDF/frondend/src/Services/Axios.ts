import axios, { AxiosInstance } from 'axios';
import { store } from "../App/Store";
import { signOut } from '../App/UserSlice';
import { refreshUserAccessToken, userLogout } from '../Api/User';


export const userApi: AxiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api/user",
  baseURL: "https://pdfsimplify.shop/api/user",
  withCredentials: true
});


userApi.interceptors.response.use(
    (response) => {
      // if (response.data.message) {
      //   toast.success(response.data.message);
      // }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error?.response?.status === 401 && error.response.data.message === 'User Credentials Invalid please SignIn') {
        await userLogout();
        store.dispatch(signOut())
  
      }
      if (error.response?.status === 401 && error.response.data?.message === 'Refresh Token Expired') {
        console.log("refresh token expired")
        await userLogout();
        store.dispatch(signOut())
  
      }
      if (error.response?.status === 401 && error.response.data?.message === "User is blocked by Admin") {
        await userLogout();
        store.dispatch(signOut())
  
  
      }
      if (error.response?.status === 404) {
        window.location.href = '/error/404';
      }
      if (error?.response?.data?.message === 'Internal Server Error') {
        window.location.href = '/error/internal';
      }
      if (error.response?.status === 401 && error.response.data.message === 'Access Token Expired' && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshUserAccessToken();
          return userApi(originalRequest);
        } catch (refreshError) {
          userLogout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  