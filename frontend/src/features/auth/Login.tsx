import { LoadingButton } from "@mui/lab"
import { Alert, Box, Button, Stack } from "@mui/material"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router"
import { useAuthUserMutation, useRegisterUserMutation } from "../api/apiSlice"
interface IFormInput {
  username: string
  password: string
}

export default function LoginOrRegister({ type }: { type: string }) {
  const navigate = useNavigate()
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation()
  const location = useLocation()
  const [authUser, { isLoading: isAuthLoading }] = useAuthUserMutation()
  const [error, setError] = useState<null | string>(null)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const isLoading = type === "register" ? isRegisterLoading : isAuthLoading

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    let mutation
    if (type === "register") {
      mutation = registerUser
    } else mutation = authUser
    try {
      await mutation({ username: data.username, password: data.password }).unwrap()
      if (type === "register") {
        navigate("/login", { state: { message: "Successfully registered! You can now login!" } })
      } else {
        navigate("/")
      }
    } catch (error: any) {
      setError(error.data.message)
    }
  }

  return (
    <Box alignItems="center" display="flex" justifyContent="center" onSubmit={handleSubmit(onSubmit)} component="form">
      <Stack width={200} gap={1} alignItems="center" justifyContent="center">
        <h1>{type === "register" ? "Sign up" : "Login"}</h1>
        {error && (
          <Alert
            sx={{ minWidth: 300 }}
            onClose={() => {
              setError(null)
            }}
            severity="error"
          >
            {error}
          </Alert>
        )}
        {location.state?.message && (
          <Alert sx={{ minWidth: 300 }} onClose={() => {}} severity="success">
            {location.state.message}
          </Alert>
        )}
        <Controller
          rules={{
            required: { value: true, message: "Username is required" },
            minLength: { value: 3, message: "Username must be at least 3 characters" },
            maxLength: { value: 20, message: "Username must be at most 20 characters" },
            pattern: { value: /^[a-zA-Z0-9]+$/, message: "Username must contain only letters and numbers" },
          }}
          name="username"
          control={control}
          render={({ field, formState }) => (
            <TextField
              helperText={formState?.errors?.username?.message}
              error={!!formState.errors?.username}
              label="Username"
              {...field}
            />
          )}
        />
        <Controller
          rules={{
            required: { value: true, message: "Password is required" },
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          }}
          name="password"
          control={control}
          render={({ field, formState }) => (
            <TextField
              autoComplete={type === "register" ? "new-password" : "current-password"}
              helperText={formState?.errors?.password?.message}
              error={!!formState?.errors?.password}
              label="Password"
              type="password"
              {...field}
            />
          )}
        />
        <Box width="100%" display="flex" justifyContent="space-between">
          <Button onClick={() => navigate(-1)}>Go back</Button>
          <LoadingButton loading={isLoading} type="submit" variant="contained">
            Submit
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  )
}
