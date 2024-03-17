import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { Box, IconButton, useTheme } from "@mui/material"
import { useContext } from "react"
import { ColorModeContext } from "../../App.js"

const ThemeToggler = () => {
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
      }}
    >
      <IconButton sx={{padding: 0}} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  )
}

export default ThemeToggler
