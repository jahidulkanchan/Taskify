import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./layouts/MainLayout.jsx";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AuthProvider from "./authProvider/AuthProvider.jsx";
import HomeLayout from "./layouts/HomeLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomeLayout/>
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
    errorElement: <div className="min-h-screen text-xl flex flex-col justify-center items-center">
    <p><img className="w-[300px]" src="/Error.svg" alt="" /></p>
    <small className="bg-slate-200 rounded-full px-5 py-1 mt-4">
      <Link to="/">Go Back</Link>
    </small>
  </div>
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
