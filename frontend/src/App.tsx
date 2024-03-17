import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { ThemeProvider, createTheme } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { createContext, useMemo, useState } from "react"
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import AccuWeatherLogo from "../assets/accuweather_logo.svg"
import "./App.css"
import Login from "./features/auth/Login"
import Favorites from "./features/favorites/Favorites"
import Layout from "./features/layout/Layout.js"
import LocationWrapper from "./features/weather/LocationWrapper.js"
import Weather from "./features/weather/Weather"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { index: true, element: <LocationWrapper /> },
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

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

const App = () => {
  const [mode, setMode] = useState<"light" | "dark">("light")
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === "light" ? "dark" : "light"))
      },
    }),
    [],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <span style={{ position: "fixed", bottom: "0", right: "0" }}>
          Data by{" "}
          <a href="https://www.accuweather.com">
            <img
              style={{
                height: "16px",
                verticalAlign: "text-top",
                paddingRight: "5px",
                filter: theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
              }}
              alt="Accuweather logo"
              src={AccuWeatherLogo}
            />
          </a>
        </span>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
