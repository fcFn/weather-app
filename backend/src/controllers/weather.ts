import { createCachedHandler } from "../helpers.js"

export const getLocation = createCachedHandler(
  "location",
  query => `https://dataservice.accuweather.com/locations/v1/${query}?apikey=${process.env.ACCUWEATHER_API_KEY}`,
)
export const currentConditions = createCachedHandler(
  "current",
  query =>
    `https://dataservice.accuweather.com/currentconditions/v1/${query}?apikey=${process.env.ACCUWEATHER_API_KEY}`,
  (result: any) => result[0],
)
export const autocompleteLocation = createCachedHandler(
  "search",
  query =>
    `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${process.env.ACCUWEATHER_API_KEY}&q=${query}`,
  (result: any) =>
    result.map((item: any) => ({
      key: item.Key,
      country: item.Country.LocalizedName,
      city: item.LocalizedName,
    })),
)
export const forecast = createCachedHandler(
  "forecast",
  query =>
    `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${query}?apikey=${process.env.ACCUWEATHER_API_KEY}&metric=true`,
)
