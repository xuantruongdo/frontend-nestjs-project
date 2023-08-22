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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>404 Not Found</div>,
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
        }
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
    </>
  );
}
