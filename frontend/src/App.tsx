import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { Box, Container } from "@mui/material"
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
        <Box
          component="h1"
          margin="0.5rem"
          sx={{ backgroundColor: "rgb(57, 160, 228)", color: "white", transform: "skew(-30deg)" }}
          display="inline-block"
          paddingX="1em"
        >
          <Box sx={{ transform: `skew(30deg)` }}>
            <span>Weath</span>
            <Box component="span" sx={{ color: "cyan", fontStyle: "italic" }}>
              r
            </Box>
          </Box>
        </Box>
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
      <span style={{ position: "fixed", bottom: "0", right: "0" }}>
        Data by <a href="https://www.accuweather.com">AccuWeather</a>
      </span>
    </>
  )
}

export default App
