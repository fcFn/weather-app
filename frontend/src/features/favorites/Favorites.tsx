// This component displays the favorites using the useGetUserQuery hook from the generated API. It also uses the useAddFavoriteMutation and useRemoveFavoriteMutation hooks to add and remove favorites.
// It reuses the CurrentConditions component to display the current weather in the favorite location.

import { Box, CircularProgress, Stack } from "@mui/material"
import { useNavigate } from "react-router"
import { useGetUserQuery } from "../api/apiSlice.js"
import CurrentConditions from "../weather/CurrentConditions.js"

const Favorites = () => {
  const { data: user, isLoading } = useGetUserQuery()
  const navigate = useNavigate()

  if (!isLoading && !user?.username) {
    navigate("/login")
  }

  return (
    <div>
      <h1>Favorites</h1>
      {isLoading ? (
        <CircularProgress/>
      ) : (
        <>
          {user?.favorites && user.favorites?.length > 0 ? (
            <Stack direction={{ sm: "row" }} useFlexGap flexWrap="wrap" spacing={2}>
              {user?.favorites?.map((cityKey, index) => (
                <Box
                  key={index}
                  sx={{
                    cursor: "pointer",
                    marginTop: { xs: "16px" },
                    width: { sm: "calc(50% - 16px)", md: "calc(25% - 16px)" },
                  }}
                >
                  <CurrentConditions onClick={() => navigate(`/weather/${cityKey}`)} cityKey={cityKey} />
                </Box>
              ))}
            </Stack>
          ) : (
            <Box display="flex" justifyContent="center">
              😟 No favorites yet
            </Box>
          )}
        </>
      )}
    </div>
  )
}

export default Favorites
