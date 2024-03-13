import { Box, Stack } from "@mui/material"
import { useGetForecastQuery } from "../api/apiSlice.js"
import ForecastWeatherBox from "./ForecastWeatherBox.js"
import type { CityData } from "./Weather.js"

const Forecast = ({ cityKey, cityData }: { cityKey?: string; cityData: CityData }) => {
  // Returns five WeatherBox components with the forecast data that is fetched from the API
  const { data: forecast, isLoading, isFetching } = useGetForecastQuery(cityKey)
  return (
    <Stack spacing={2} useFlexGap flexWrap="wrap" direction={{ sm: "row" }}>
      {forecast?.DailyForecasts.map((day: any, index: number) => {
        return (
          <Box
            key={index}
            sx={{
              marginTop: { xs: "16px" },
              width: { sm: "calc(50% - 16px)", md: "calc(33% - 16px)", lg: "calc(20% - 16px)" },
            }}
          >
            <ForecastWeatherBox isLoading={isLoading} isFetching={isFetching} day={day} />
          </Box>
        )
      })}
    </Stack>
  )
}

export default Forecast
