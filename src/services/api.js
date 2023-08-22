import axios from "../config/axios-customize";

export const callRegister = (data) => {
  return axios.post("/api/v1/auth/register", data);
};

export const callLogin = (data) => {
  return axios.post("/api/v1/auth/login", data);
};
export const callFetchCompanies = (query) => {
  return axios.get(`/api/v1/companies?${query}`);
};
export const callFetchJobs = (query) => {
  return axios.get(`/api/v1/jobs?${query}`);
};
export const callFetchJobById = (id) => {
  return axios.get(`/api/v1/jobs/${id}`);
};
export const callFetchCompanyById = (id) => {
  return axios.get(`/api/v1/companies/${id}`);
};