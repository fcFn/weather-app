import { Alert, Box, Container, Snackbar } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks.js"
import Navigation from "../navigation/Navigation.js"
import { closeSnackbar } from "../snackbar/snackbarSlice.js"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { open, message, severity } = useAppSelector(state => state.snackbar)
  const dispatch = useAppDispatch()
  return (
    <Container maxWidth="lg" className="App">
      <Box
        component="h1"
        margin="0.5rem"
        sx={{ backgroundColor: "rgb(57, 160, 228)", color: "white", transform: "skew(-30deg)" }}
        display="inline-block"
        paddingX="1em"
      >
        <Box sx={{ transform: `skew(30deg)` }}>
          <span>Weath</span>
          <Box component="span" sx={{ color: "cyan", fontStyle: "italic" }}>
            r
          </Box>
        </Box>
      </Box>
      <Navigation />
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        key="topcenter"
        autoHideDuration={5000}
        onClose={() => dispatch(closeSnackbar())}
      >
        <Alert sx={{ bgcolor: "background.paper" }} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Layout
