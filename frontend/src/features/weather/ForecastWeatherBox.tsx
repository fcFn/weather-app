import { Card, CardContent, Skeleton } from "@mui/material"

interface DailyForecastDay {
  Date: string
  Day: {
    Icon: number
    IconPhrase: string
  }
  Night: {
    Icon: number
    IconPhrase: string
  }
  Temperature: {
    Maximum: {
      Value: number
      Unit: string
    }
    Minimum: {
      Value: number
      Unit: string
    }
  }
}

const ForecastWeatherBox = ({
  day,
  isLoading,
  isFetching,
}: {
  day: DailyForecastDay
  isLoading: boolean
  isFetching: boolean
}) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        {isLoading || isFetching ? <Skeleton variant="text" /> : <h3>{day.Date.split("T")[0]}</h3>}
        {isLoading || isFetching ? (
          <Skeleton variant="rectangular" width={100} height={100} />
        ) : (
          <img
            src={`https://developer.accuweather.com/sites/default/files/${day.Day.Icon < 10 ? `0${day.Day.Icon}` : day.Day.Icon}-s.png`}
            alt="Weather icon"
            style={{ maxWidth: "100px", marginLeft: "auto", marginRight: "auto", display: "block" }}
          />
        )}
        {isLoading || isFetching ? (
          <Skeleton variant="text" />
        ) : (
          <p style={{ flex: "1 0 auto" }}>{day.Day.IconPhrase}</p>
        )}
        {isLoading || isFetching ? (
          <Skeleton variant="text" />
        ) : (
          <p>
            {day.Temperature.Maximum.Value}°C / {day.Temperature.Minimum.Value}°C
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default ForecastWeatherBox
