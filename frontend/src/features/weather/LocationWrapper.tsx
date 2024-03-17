import { CircularProgress } from "@mui/material"
import { useLayoutEffect } from "react"
import { useNavigate } from "react-router"

// Tries to get geolocation of the user, fetches the cityKey and redirects to
// the weather page for the given location or the default (Tel Aviv)
const LocationWrapper = () => {
  const navigate = useNavigate()
  useLayoutEffect(
    () =>
      (() => {
        if (!("geolocation" in navigator)) return navigate("/weather/215854")
        navigator.geolocation.getCurrentPosition(
          position => {
            const latLon = `${position.coords.latitude},${position.coords.longitude}`
            fetch(import.meta.env.VITE_BACKEND_URL + `/coordinates?q=${latLon}`)
              .then(response => response.json())
              .then(data => navigate(`/weather/${data.key}`))
          },
          () => navigate("/weather/215854"),
        )
      })(),
    [navigate],
  )

  return <CircularProgress />
}

export default LocationWrapper
