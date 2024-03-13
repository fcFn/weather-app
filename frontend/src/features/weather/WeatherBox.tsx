import { Box, Card, CardContent, Skeleton } from "@mui/material"

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
          {cityData ? <h2>{cityData?.LocalizedName}</h2> : <Skeleton variant="text" />}
          {cityData ? <h4>{cityData?.Country.LocalizedName}</h4> : <Skeleton variant="text" />}
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
          {weatherData ? <p>{weatherData.WeatherText}</p> : <Skeleton variant="text" />}
          {weatherData ? <p>{weatherData.Temperature.Metric.Value}°C</p> : <Skeleton variant="text" />}
        </Box>
      </CardContent>
    </Card>
  )
}

export default CurrentWeatherBox
