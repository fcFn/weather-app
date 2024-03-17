import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

interface State {
  unit: Unit
}

const initialState: State = {
  unit: "C",
}

type Unit = "F" | "C"

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    toggleUnit: state => {
      state.unit = state.unit === "C" ? "F" : "C"
    },
  },
})

export const { toggleUnit } = weatherSlice.actions
export default weatherSlice.reducer
