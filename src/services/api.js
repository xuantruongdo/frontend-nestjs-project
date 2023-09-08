import axios from "../config/axios-customize";

// Auth
export const callRegister = (data) => {
  return axios.post("/api/v1/auth/register", data);
};
export const callLogin = (data) => {
  return axios.post("/api/v1/auth/login", data);
};
export const callRefreshToken = () => {
  return axios.get("/api/v1/auth/refresh",);
};
export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};
export const callFetchCurrentAccount = () => {
  return axios.get(`/api/v1/auth/account`);
};

//Upload
export const callUploadSingleFile = (file, folderType) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileUpload', file);
  return axios({
    method: 'post',
    url: '/api/v1/files/upload',
    data: bodyFormData,
    headers: {
        "Content-Type": "multipart/form-data",
        "folder_type": folderType
    },
  });
};

//Companies
export const callFetchCompanies = (query) => {
  return axios.get(`/api/v1/companies?${query}`);
};
export const callFetchCompanyById = (id) => {
  return axios.get(`/api/v1/companies/${id}`);
};
export const callCreateCompany = (data) => {
  return axios.post(`/api/v1/companies`, data);
};
export const callUpdateCompany = (data, id) => {
  return axios.patch(`/api/v1/companies/${id}`, data);
};
export const callDeleteCompany = (id) => {
  return axios.delete(`/api/v1/companies/${id}`);
};
//Jobs
export const callFetchJobs = (query) => {
  return axios.get(`/api/v1/jobs?${query}`);
};
export const callFetchJobById = (id) => {
  return axios.get(`/api/v1/jobs/${id}`);
};

//Resume
export const callCreateResume = (data) => {
  return axios.post(`/api/v1/resumes`, data);
};

export const callFetchResumesByUserId = () => {
  return axios.get(`/api/v1/resumes/userId`);
};

//Subscriber
export const callFetchSkills = () => {
  return axios.get('/api/v1/subscribers/skills')
}
export const callUpdateSkills = (data) => {
  return axios.patch('/api/v1/subscribers/skills', data)
}

//User
export const callFetchUsers = (query) => {
  return axios.get(`/api/v1/users?${query}`);
};

//File
export const callUploadLogo = (fileImg, folder_type) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileUpload", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/files/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
      "folder_type": folder_type
    },
  });
};