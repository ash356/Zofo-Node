import { uncaughtException, unhandledRejection } from "./src/Utils/errorHandling.js"
uncaughtException();
import express from "express"
import initApp from "./src/app.router.js"
import dotenv from "dotenv"
// DotENV Config
dotenv.config({ path: "./config/.env" })
const app = express()
// Port
const port = process.env.PORT || 5000
// Init App
initApp(app, express)
// Listenning Port
app.listen(port, () => {
    console.log(`Server is Running... \nPort : ${port}`);
})
unhandledRejection();
