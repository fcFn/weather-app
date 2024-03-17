import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material"
import WeatherValue from "./WeatherValue.js"

const CurrentWeatherBox = ({
  weatherData,
  cityData,
  onClick,
}: {
  weatherData: any
  cityData: any
  onClick?: () => void
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        height: { sm: "100%" },
        "& *": { margin: 0 },
      }}
    >
      <CardContent sx={{ display: "flex", height: "100%", justifyContent: "space-between" }}>
        <Box>
          {cityData ? <Typography variant="h5">{cityData?.LocalizedName}</Typography> : <Skeleton variant="text" />}
          {cityData ? (
            <Typography variant="h6">{cityData?.Country.LocalizedName}</Typography>
          ) : (
            <Skeleton variant="text" />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100%",
          }}
        >
          {weatherData ? (
            <img
              src={`https://developer.accuweather.com/sites/default/files/${weatherData.WeatherIcon < 10 ? `0${weatherData.WeatherIcon}` : weatherData.WeatherIcon}-s.png`}
              alt="Weather icon"
            />
          ) : (
            <Skeleton variant="rectangular" width={100} height={60} />
          )}
          {weatherData ? <Typography>{weatherData.WeatherText}</Typography> : <Skeleton variant="text" />}
          {weatherData ? (
            <Typography>
              <WeatherValue value={weatherData.Temperature.Metric.Value} />
            </Typography>
          ) : (
            <Skeleton variant="text" />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default CurrentWeatherBox
