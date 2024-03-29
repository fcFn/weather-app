import type { Express } from "express"
import { favorite, getUser, login, logout, register } from "./controllers/user.js"
import {
  autocompleteLocation,
  currentConditions,
  forecast,
  getLocation,
  getLocationByCoordinates,
} from "./controllers/weather.js"
import session from "./middlewares/session.js"

export default function setupRoutes(app: Express) {
  app.post("/favorite/:cityKey", session, favorite)
  app.delete("/favorite/:cityKey", favorite)
  app.get("/location", getLocation)
  app.get("/search", autocompleteLocation)
  app.get("/current-conditions", currentConditions)
  app.get("/forecast", forecast)
  app.get("/coordinates", getLocationByCoordinates)
  app.get("/user", session, getUser)
  app.post("/login", session, login)
  app.post("/register", register)
  app.get("/logout", session, logout)
}
