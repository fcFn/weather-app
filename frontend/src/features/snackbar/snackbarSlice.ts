import { createSlice } from "@reduxjs/toolkit"

interface InitialState {
  open: boolean
  message: string
  severity: "success" | "info" | "warning" | "error"
}

const initialState = {
  open: false,
  message: "",
  severity: "success",
} satisfies InitialState as InitialState

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    displaySnackbar: (state, action) => {
      state.open = true
      state.message = action.payload.message
      state.severity = action.payload.severity
    },
    closeSnackbar: (state) => {
      state.open = false
    }
  },
})

export const { displaySnackbar, closeSnackbar } = snackbarSlice.actions
export default snackbarSlice.reducer
