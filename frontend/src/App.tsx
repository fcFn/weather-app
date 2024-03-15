import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import CssBaseline from "@mui/material/CssBaseline"
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import AccuWeatherLogo from "../assets/accuweather_logo.svg"
import "./App.css"
import Login from "./features/auth/Login"
import Favorites from "./features/favorites/Favorites"
import Weather from "./features/weather/Weather"
import Layout from "./features/layout/Layout.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { index: true, element: <Navigate to="/weather/215854" /> },
      {
        path: "/login",
        element: <Login key="foo" type="login" />,
      },
      {
        path: "/register",
        element: <Login key="bar" type="register" />,
      },
      { path: "/weather/:cityKey", element: <Weather /> },
      {
        path: "/favorites",
        element: <Favorites />,
      },
    ],
  },
])

const App = () => {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
      <span style={{ position: "fixed", bottom: "0", right: "0" }}>
        Data by{" "}
        <a href="https://www.accuweather.com">
          <img
            style={{ height: "16px", verticalAlign: "text-top", paddingRight: "5px" }}
            alt="Accuweather logo"
            src={AccuWeatherLogo}
          />
        </a>
      </span>
    </>
  )
}

export default App
