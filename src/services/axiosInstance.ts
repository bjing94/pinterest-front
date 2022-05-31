import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_PRODUCTION
    : process.env.REACT_APP_API_DEV;

const frontURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_FRONT_PRODUCTION
    : process.env.REACT_APP_FRONT_DEV;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "api-key": process.env.REACT_APP_API_KEY || "no-key",
  },
});
export { axiosInstance, baseURL, frontURL };
