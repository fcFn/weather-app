import { Autocomplete, Box, TextField, debounce } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Place {
    key: number,
    country: string,
    city: string
}

const Search = () => {
    const [options, setOptions] = useState<Place[]>([])
    const [inputValue, setInputValue] = useState('')
    const [value, setValue] = useState<Place | null>(null)
    const navigate = useNavigate()

    const fetchSuggestions = React.useMemo(
        () =>
            debounce(
                async (
                    request: { input: string },
                    callback: (results: Place[]) => void
                ) => {
                    let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search?q=${request.input}`)
                    const result: Place[] = await response.json()
                    callback(result)
                },
                1000,
            ),
        [],
    );
    React.useEffect(() => {
        let active = true;
        (async () => {

            // This is needed so that we don't fetch suggestions after selecting
            // an option
            if (value?.city === inputValue) {
                return undefined
            }
            if (inputValue === '') {
                return undefined;
            }

            await fetchSuggestions({ input: inputValue }, (results?: Place[]) => {
                if (active) {
                    let newOptions: Place[] = []

                    if (results) {
                        newOptions = results
                    }

                    setOptions(newOptions);
                }
            });
        })()

        return () => {
            active = false;
        };
    }, [value, inputValue, fetchSuggestions]);

    return (
        <Box>

            <Autocomplete
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : `${option.city}, ${option.country}`
                }
                options={options}
                autoComplete
                includeInputInList
                noOptionsText="Nothing found"
                onChange={(event: any, newValue: Place | null) => {
                    setValue(newValue);
                    if (newValue?.key) {
                        navigate(`/weather/${newValue.key}`)
                    }
                }}
                open={value !== null || options.length > 0}
                value={value}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue.replace(/[^a-zA-Z\s]/g, ''))
                }}
                renderInput={(params) => <TextField  {...params} label="Search city" />}
                filterOptions={(x) => x} />
        </Box>
    )
}

export default Search
