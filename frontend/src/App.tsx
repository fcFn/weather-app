import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { Container } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import Login from "./features/auth/Login"
import Favorites from "./features/favorites/Favorites"
import Navigation from "./features/navigation/Navigation"
import Weather from "./features/weather/Weather"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Container maxWidth="lg" className="App">
        <Navigation />

        <Outlet />
      </Container>
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
      <span style={{ position: "absolute", bottom: "0", right: "0" }}>
        Data by <a href="https://www.accuweather.com">AccuWeather</a>
      </span>
    </>
  )
}

export default App
