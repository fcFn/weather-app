import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit"
import { isRejectedWithValue } from "@reduxjs/toolkit"
import { displaySnackbar } from "../features/snackbar/snackbarSlice"

export const rtkQueryGenericErrorHandler: Middleware = (api: MiddlewareAPI) => next => action => {
  if (isRejectedWithValue(action)) {
    api.dispatch(
      displaySnackbar({
        message: "An error occurred. Please try again later.",
        severity: "error",
      }),
    )
  }

  return next(action)
}
