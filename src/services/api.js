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
export const callFetchAllCompanies = () => {
  return axios.get(`/api/v1/companies?current=1&pageSize=50`);
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
export const callCreateJob = (data) => {
  return axios.post(`/api/v1/jobs`, data);
};
export const callUpdateJob = (id, data) => {
  return axios.patch(`/api/v1/jobs/${id}`, data);
};
export const callDeleteJob = (id) => {
  return axios.delete(`/api/v1/jobs/${id}`);
};

//Resume
export const callFetchResumes = (query) => {
  return axios.get(`/api/v1/resumes?${query}`);
};
export const callCreateResume = (data) => {
  return axios.post(`/api/v1/resumes`, data);
};
export const callFetchResumesByUserId = () => {
  return axios.get(`/api/v1/resumes/userId`);
};
export const callUpdateStatusResume = (id, data) => {
  return axios.patch(`/api/v1/resumes/${id}`, data);
};
export const callDeleteResume = (id) => {
  return axios.delete(`/api/v1/resumes/${id}`);
};

//Subscriber
export const callFetchSkills = () => {
  return axios.get('/api/v1/subscribers/skills')
}
export const callCreateSkills = (data) => {
  return axios.post('/api/v1/subscribers', data)
}
export const callUpdateSkills = (data) => {
  return axios.patch('/api/v1/subscribers/skills', data)
}

//User
export const callFetchUsers = (query) => {
  return axios.get(`/api/v1/users?${query}`);
};
export const callCreateUser = (data) => {
  return axios.post(`/api/v1/users`, data);
};
export const callUpdateUser = (id, data) => {
  return axios.patch(`/api/v1/users/${id}`, data);
};
export const callUpdateUserByAdmin = (id, data) => {
  return axios.patch(`/api/v1/users/update-user-by-admin/${id}`, data);
};
export const callChangePassword = (id, data) => {
  return axios.patch(`/api/v1/users/change-password/${id}`, data);
};
export const callDeleteUser = (id) => {
  return axios.delete(`/api/v1/users/${id}`);
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
//Roles
export const callFetchRoles = (query) => {
  return axios.get(`/api/v1/roles?${query}`);
};
export const callFetchAllRoles = () => {
  return axios.get(`/api/v1/roles?current=1&pageSize=100`);
};
export const callCreateRole = (data) => {
  return axios.post(`/api/v1/roles`, data);
};
export const callUpdateRole = (id, data) => {
  return axios.patch(`/api/v1/roles/${id}`, data);
};
export const callDeleteRole = (id) => {
  return axios.delete(`/api/v1/roles/${id}`);
};
//Permissions
export const callFetchPermissions = () => {
  return axios.get(`/api/v1/permissions?current=1&pageSize=100`);
};
export const callFetchPermissionsPaginnate = (query) => {
  return axios.get(`/api/v1/permissions?${query}`);
};
export const callCreatePermission = (data) => {
  return axios.post(`/api/v1/permissions`, data);
};
export const callUpdatePermission = (id, data) => {
  return axios.patch(`/api/v1/permissions/${id}`, data);
};
export const callDeletePermission = (id) => {
  return axios.delete(`/api/v1/permissions/${id}`);
};

//Count
export const callCountUser = () => {
  return axios.get(`/api/v1/users/count`);
};
export const callCountCompany = () => {
  return axios.get(`/api/v1/companies/count`);
};
export const callCountJob = () => {
  return axios.get(`/api/v1/jobs/count`);
};
export const callCountCV = () => {
  return axios.get(`/api/v1/resumes/count`);
};