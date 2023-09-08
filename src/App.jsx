import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import LoginPage from "./pages/login";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./components/Home";
import RegisterPage from "./pages/register";
import CompanyPage from "./pages/company";
import JobDetailPage from "./pages/jobDetail";
import JobListPage from "./pages/jobList";
import CompanyDetail from "./pages/companyDetail";
import { callFetchCurrentAccount } from "./services/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardAdminPage from "./pages/admin/dashboard";
import CompanyAdminPage from "./pages/admin/company/company";
import UserAdminPage from "./pages/admin/user/user";
import JobAdminPage from "./pages/admin/job/job";
import ResumeAdminPage from "./pages/admin/resume";
import PermissionAdminPage from "./pages/admin/permission";
import RoleAdminPage from "./pages/admin/role";

const Layout = () => {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default function App() {

  const dispatch = useDispatch();

  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
      // || window.location.pathname === '/'
    ) return;
    const res = await callFetchCurrentAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound/>,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "job/",
          element: <JobListPage/>
        },
        {
          path: "job/:slug",
          element: <JobDetailPage/>
        },
        {
          path: "company",
          element: <CompanyPage/>
        },
        {
          path: "company/:slug",
          element: <CompanyDetail/>
        }
      ]
    },
    {
      path: "/admin",
      element: 
        <ProtectedRoute>
          <AdminPage />
      </ProtectedRoute>
      ,
      errorElement: <NotFound/>,
      children: [
        {
          index: true, element:
          <ProtectedRoute>
          <DashboardAdminPage />
        </ProtectedRoute>
        },
        {
          path: "company",
          element:
            <ProtectedRoute>
              <CompanyAdminPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserAdminPage />
            </ProtectedRoute>
        },
        {
          path: "job",
          element:
            <ProtectedRoute>
              <JobAdminPage />
            </ProtectedRoute>
        },
        {
          path: "resume",
          element:
            <ProtectedRoute>
              <ResumeAdminPage />
            </ProtectedRoute>
        },
        {
          path: "permission",
          element:
            <ProtectedRoute>
              <PermissionAdminPage />
            </ProtectedRoute>
        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RoleAdminPage />
            </ProtectedRoute>
        },
      ]
    },
    {
      path: "/login",
      element: <LoginPage/>,
    },
    {
      path: "/register",
      element: <RegisterPage/>,
    },
  ]);


  return (
    <>
      <RouterProvider router={router} />
      {/* <Loading/> */}
    </>
  );
}
