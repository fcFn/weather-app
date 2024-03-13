import { Alert, Box, Button, Stack } from "@mui/material"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router"
import { useAppDispatch } from "../../app/hooks.js"
import { useAuthUserMutation, useRegisterUserMutation } from "../api/apiSlice"
interface IFormInput {
  username: string
  password: string
}

export default function LoginOrRegister({ type}: {type: string }) {
  const navigate = useNavigate()
  const [registerUser, registerResponse] = useRegisterUserMutation()
  const dispatch = useAppDispatch()
  const location = useLocation()
  const [authUser, authResponse] = useAuthUserMutation()
  const [error, setError] = useState<null | string>(null)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    let mutation
    if (type === "register") {
      mutation = registerUser
    } else mutation = authUser
    try {
      const user = await mutation({ username: data.username, password: data.password }).unwrap()
      if (type === "register") {
        navigate("/login", { state: { message: "Successfully registered! You can now login!" } })
      } else {
        navigate("/")
      }
    } catch (error: any){
      setError(error.data.message)
    }
  }

  return (
    <Box alignItems="center" display="flex" justifyContent="center" onSubmit={handleSubmit(onSubmit)} component="form">
      <Stack width={200} gap={1} alignItems="center" justifyContent="center">
        <h1>{type === "register" ? "Register" : "Login"}</h1>
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
          name="username"
          control={control}
          render={({ field }) => <TextField label="Username" {...field} />}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => <TextField label="Password" type="password" {...field} />}
        />
        <Box width="100%" display="flex" justifyContent="space-between">
          <Button onClick={() => navigate(-1)}>Go back</Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
