import { useAppSelector } from "../../app/hooks.js"

function convertCelsiusToFahrenheit(celsius: number) {
  return (celsius * 1.8 + 32).toPrecision(3)
}

const WeatherValue = ({ value }: { value: number }) => {
  const unit = useAppSelector(state => state.weather.unit)
  if (unit === "F") {
    return <>{convertCelsiusToFahrenheit(value)}°F</>
  } else {
    return <>{value}°C</>
  }
}

export default WeatherValue
