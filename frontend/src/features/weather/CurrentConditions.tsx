import { useGetCurrentConditionsQuery, useGetLocationQuery } from "../api/apiSlice.js"
import CurrentWeatherBox from "./WeatherBox.js"

const CurrentConditions = ({ cityKey, onClick }: {cityKey: string, onClick?: () => void }) => {
  const { data, isLoading, isFetching } = useGetCurrentConditionsQuery(cityKey)
  const { data: cityData, isLoading: cityDataIsLoading, isFetching: cityDataIsFetching } = useGetLocationQuery(cityKey)

  return <CurrentWeatherBox onClick={onClick} cityData={cityData} weatherData={data} />
}

export default CurrentConditions
