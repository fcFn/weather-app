import { useGetCurrentConditionsQuery, useGetLocationQuery } from "../api/apiSlice.js"
import CurrentWeatherBox from "./WeatherBox.js"

const CurrentConditions = ({ cityKey, onClick }: { cityKey: string; onClick?: () => void }) => {
  const { data } = useGetCurrentConditionsQuery(cityKey)
  const { data: cityData } = useGetLocationQuery(cityKey)

  return <CurrentWeatherBox onClick={onClick} cityData={cityData} weatherData={data} />
}

export default CurrentConditions
