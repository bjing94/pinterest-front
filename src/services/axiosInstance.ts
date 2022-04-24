import axios from "axios";

const baseURL = `http://localhost:3000/`;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export { axiosInstance, baseURL };
