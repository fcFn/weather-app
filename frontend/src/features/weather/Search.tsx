import { Autocomplete, Box, TextField, debounce } from "@mui/material"
import React, { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Place {
  key: number
  country: string
  city: string
}

const Search = () => {
  const nameRegex = useRef(/[^a-zA-Z\s'-,]/g)
  const [options, setOptions] = useState<Place[]>([])
  const [inputValue, setInputValue] = useState("")
  const [value, setValue] = useState<Place | null>(null)
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState("")
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (request: { input: string }, callback: (results: Place[]) => void) => {
        let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search?q=${request.input}`)
        const result: Place[] = await response.json()
        callback(result)
      }, 1000),
    [],
  )
  React.useEffect(() => {
    let active = true
    ;(async () => {
      // This is needed so that we don't fetch suggestions after selecting
      // an option
      if (`${value?.city}, ${value?.country}` === inputValue) {
        return undefined
      }
      if (inputValue === "") {
        return undefined
      }

      await fetchSuggestions({ input: inputValue }, (results?: Place[]) => {
        if (active) {
          let newOptions: Place[] = []

          if (results) {
            // Strip non-English letters from the city and country names
            // But leave - ' ,
            newOptions = results.map((result: Place) => {
              result.country = result.country.replace(nameRegex.current, "")
              result.city = result.city.replace(nameRegex.current, "")
              return result
            })
          }

          setOptions(newOptions)
        }
      })
    })()

    return () => {
      active = false
    }
  }, [value, inputValue, fetchSuggestions])

  return (
    <Box>
      <Autocomplete
        getOptionLabel={option => (typeof option === "string" ? option : `${option.city}, ${option.country}`)}
        options={options}
        autoComplete
        loading={open && options.length === 0}
        loadingText="Loading..."
        includeInputInList
        noOptionsText="Nothing found"
        onChange={(event: any, newValue: Place | null) => {
          setValue(newValue)
          if (newValue?.key) {
            navigate(`/weather/${newValue.key}`)
          }
        }}
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          // The input is controlled to prevent the default behavior
          // of showing the options when the input is empty.
          // If value has non-English letters, display an error
          if (newInputValue.match(nameRegex.current)) {
            setHelperText("Only English letters are allowed")
            setError(true)
            return setOpen(false)
          } else {
            setHelperText("")
            setError(false)
          }

          const value = newInputValue.replace(nameRegex.current, "")
          if (value.length) {
            setOpen(true)
            setOptions([])
          } else {
            setOpen(false)
          }

          setInputValue(value)
        }}
        renderInput={params => <TextField error={error} helperText={helperText} {...params} label="Search city" />}
        filterOptions={x => x}
      />
    </Box>
  )
}

export default Search
