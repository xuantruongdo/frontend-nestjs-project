import axios from "axios";
import { callRefreshToken } from "../services/api";

const baseUrl = import.meta.env.VITE_BACKEND_URL;
const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

instance.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}

const handleRefreshToken = async () => {
  const res = await callRefreshToken();
  if (res && res.data) return res.data.access_token;
  else return null

}

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const NO_RETRY_HEADER = "x-no-retry";

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    //Hết hạn access token
    if (error.config && error.response && +error.response.status === 401) {
      const access_token = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true";
      
      if (access_token) {
        error.config.headers['Authorization'] = `Bearer ${access_token}`;
        localStorage.setItem('access_token', access_token)
        return instance.request(error.config);
      }
    }


    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
