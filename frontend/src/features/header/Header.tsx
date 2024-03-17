import { Box, Skeleton, Stack, Typography } from "@mui/material"
import { Link, useLocation, useParams } from "react-router-dom"
import { useGetUserQuery, useLogoutMutation } from "../api/apiSlice"
import ThemeToggler from "../theme-toggler/ThemeToggler.js"
import UnitSwitch from "./UnitSwitch.js"

const Navigation = () => {
  const { data: user, isLoading } = useGetUserQuery()
  const [logout] = useLogoutMutation()
  const locationState = useLocation()
  const { cityKey: cityKeyParam } = useParams()
  let cityKey = locationState?.state?.cityKey
  if (!cityKey) {
    cityKey = cityKeyParam || "215854"
  }

  const loggedInLinks = [{ to: "/favorites", text: "Favorites" }]

  const loggedOutLinks = [
    { to: "/login", text: "Login" },
    { to: "/register", text: "Sign up" },
  ]

  const links = user?.username ? loggedInLinks : loggedOutLinks

  return isLoading ? (
    <Stack mb="1rem" direction="row" spacing="3em">
      <Skeleton variant="text" sx={{ flex: "1 0 auto" }} />
      <Box component="span" sx={{ flex: "1 0 auto" }} />
      <Skeleton variant="text" sx={{ flex: "1 0 auto" }} />
    </Stack>
  ) : (
    <Stack mb="1rem" direction={{ sm: "row" }} alignItems={{ sm: "center" }}>
      <Box sx={{ flex: "1 0 auto", textAlign: "left" }} component="span">
        Welcome, {user?.username ?? "Guest"}
      </Box>
      <Stack alignItems={"center"} gap={2} direction="row" justifyContent="space-between">
        <Stack direction="row" gap={2}>
          <Link to={`/weather/${cityKey}`}>
            <Typography>Weather</Typography>
          </Link>
          {links.map((link, index) => (
            <Link key={index} to={link.to} state={{ cityKey }}>
              <Typography>{link.text}</Typography>
            </Link>
          ))}
          {user?.username && (
            <button className="link-button" onClick={() => logout()}>
              <Typography>Logout</Typography>
            </button>
          )}
        </Stack>
        <Stack direction="row">
          <UnitSwitch />
          <ThemeToggler />
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Navigation
