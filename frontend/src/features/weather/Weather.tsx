import { useParams } from "react-router-dom"
import CurrentConditions from "./CurrentConditions.js"
import Search from "./Search.js"

import { Box, Button, Stack } from "@mui/material"
import {
  useAddFavoriteMutation,
  useGetLocationQuery,
  useGetUserQuery,
  useRemoveFavoriteMutation,
} from "../api/apiSlice.js"
import Forecast from "./Forecast.js"

export interface CityData {
  Key: string
  LocalizedName: string
  Country: {
    LocalizedName: string
  }
}

export interface WeatherData {
  WeatherText: string
  Temperature: {
    Metric: {
      Value: number
    }
  }
}

const Weather = () => {
  const { data: user, isLoading: userIsLoading } = useGetUserQuery()
  let { cityKey } = useParams()
  const { data, isLoading, isFetching } = useGetLocationQuery(cityKey)
  const [addFavorite] = useAddFavoriteMutation()
  const [removeFavorite] = useRemoveFavoriteMutation()

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Search />
      <Stack direction={{ sm: "row" }} mt="1em" gap={2}>
        <Box sx={{ width: { sm: "50vw", md: "33%" } }}>
          <CurrentConditions cityKey={cityKey ?? ""} />
        </Box>
        <Box display={{ xs: "flex", sm: "block" }}>
          {cityKey && !userIsLoading && user?.username && (
            <Button
              variant="outlined"
              onClick={() =>
                user?.favorites?.includes(cityKey ?? "") ? removeFavorite(cityKey ?? "") : addFavorite(cityKey ?? "")
              }
            >
              <span>{user?.favorites?.includes(cityKey) ? "Remove from favorites" : "Add to favorites"}</span>
            </Button>
          )}
        </Box>
      </Stack>
      <Box component="h2" textAlign={"left"}>
        Forecast
      </Box>
      <Forecast cityKey={cityKey} cityData={data} />
    </>
  )
}

export default Weather
