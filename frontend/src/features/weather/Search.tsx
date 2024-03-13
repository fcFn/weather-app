import { Autocomplete, Box, TextField, debounce } from "@mui/material"
import React, { useState } from "react"
import { set } from "react-hook-form"
import { useNavigate } from "react-router-dom"

interface Place {
  key: number
  country: string
  city: string
}

const Search = () => {
  const [options, setOptions] = useState<Place[]>([])
  const [inputValue, setInputValue] = useState("")
  const [value, setValue] = useState<Place | null>(null)
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState("")
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const fetchSuggestions = React.useMemo(
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
      if (value?.city === inputValue) {
        return undefined
      }
      if (inputValue === "") {
        return undefined
      }

      await fetchSuggestions({ input: inputValue }, (results?: Place[]) => {
        if (active) {
          let newOptions: Place[] = []

          if (results) {
            newOptions = results
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
        includeInputInList
        noOptionsText="Nothing found"
        onChange={(event: any, newValue: Place | null) => {
          setValue(newValue)
          if (newValue?.key) {
            navigate(`/weather/${newValue.key}`)
          }
        }}
        open={open && options.length > 0}
        onClose={() => setOpen(false)}
        value={value}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          // The input is controlled to prevent the default behavior
          // of showing the options when the input is empty.
          // If value has non-English letters, display an error
          if (newInputValue.match(/[^a-zA-Z\s]/g)) {
              setHelperText("Only English letters are allowed")
              setError(true)
              return setOpen(false)
            } else {
                setHelperText("")
                setError(false)
            }
            
          const value = newInputValue.replace(/[^a-zA-Z\s]/g, "") 
          if (value.length) {
            setOpen(true)
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
