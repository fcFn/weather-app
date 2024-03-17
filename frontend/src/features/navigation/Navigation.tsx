import { Box, Skeleton, Stack, Typography } from "@mui/material"
import { Link, useLocation, useParams } from "react-router-dom"
import { useGetUserQuery, useLogoutMutation } from "../api/apiSlice"
import ThemeToggler from "../theme-toggler/ThemeToggler.js"

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
    <Stack direction="row" spacing="3em">
      <Skeleton variant="text" sx={{ flex: "1 0 auto" }} />
      <Box component="span" sx={{ flex: "1 0 auto" }} />
      <Skeleton variant="text" sx={{ flex: "1 0 auto" }} />
    </Stack>
  ) : (
    <Stack direction="row">
      <Box sx={{ flex: "1 0 auto", textAlign: "left" }} component="span">
        Welcome, {user?.username ?? "Guest"}
      </Box>
      <Stack mb="1rem" direction="row" gap={2}>
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
        <ThemeToggler />
      </Stack>
    </Stack>
  )
}

export default Navigation
