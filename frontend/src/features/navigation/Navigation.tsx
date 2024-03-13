import { Skeleton, Stack } from "@mui/material"
import { Link, useLocation, useParams } from "react-router-dom"
import { useGetUserQuery, useLogoutMutation } from "../api/apiSlice"

const Navigation = () => {
  const { data: user, isLoading } = useGetUserQuery()
  const [logout] = useLogoutMutation()
  const locationState = useLocation()
  const { cityKey: cityKeyParam } = useParams()
  let cityKey = locationState?.state?.cityKey
  if (!cityKey) {
    cityKey = cityKeyParam
  }

  const loggedInLinks = [{ to: "/favorites", text: "Favorites" }]

  const loggedOutLinks = [
    { to: "/login", text: "Login" },
    { to: "/register", text: "Register" },
  ]

  const links = user?.username ? loggedInLinks : loggedOutLinks

  return isLoading ? (
    <Skeleton />
  ) : (
    <Stack mb="1rem" direction="row" gap={2}>
      {links.map((link, index) => (
        <Link key={index} to={link.to} state={{ cityKey }}>
          {link.text}
        </Link>
      ))}
      <Link to={`/weather/${cityKey}`}>Weather</Link>
      {user?.username && (
        <button className="link-button" onClick={() => logout()}>
          Logout
        </button>
      )}
    </Stack>
  )
}

export default Navigation
