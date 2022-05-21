import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_PRODUCTION
    : `http://localhost:3000`;

const frontURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_FRONT_PRODUCTION
    : `http://localhost:3001`;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "api-key": process.env.REACT_APP_API_KEY || "no-key",
  },
});

export { axiosInstance, baseURL, frontURL };
