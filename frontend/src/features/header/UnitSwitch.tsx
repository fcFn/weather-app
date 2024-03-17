import type { Theme } from "@mui/material"
import { Switch, useTheme } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useAppDispatch } from "../../app/hooks.js"
import { toggleUnit } from "../weather/weatherSlice.js"

const StyledSwitch = styled(Switch)(({ theme }: { theme: Theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        content: "'F'",
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "'C'",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: "4px",
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}))

const UnitSwitch = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  return <StyledSwitch theme={theme} onChange={() => dispatch(toggleUnit())} />
}

export default UnitSwitch
