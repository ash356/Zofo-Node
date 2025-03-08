import morgan from "morgan";
import connectDB from "./Database/connection.js";
import { globalErrorHandler } from "./Utils/errorHandling.js";
import cors from "cors"
// Path & dirname
// import path from "path"
// import { fileURLToPath } from "url"
import routers from "./Utils/routers.js";
// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const fullPath = path.join(__dirname, "./uploads")
// Init App 
const initApp = (app, express) => {
    // Make Routes Case Sensitive ( Must Before Buffer Data)
    app.set("case sensitive routing", true);
    // Convert BufferData
    app.use(express.json({}));
    // To Allow Front End Request
    app.use(cors());
    // Database Connection
    connectDB();
    // Allow Open Uploaded Files
    // app.use(express.static(fullPath))
    // Morgan
    if (process.env.MOOD == "DEV") {
        app.use(morgan('dev'))
    }
    else {
        app.use(morgan('tiny'))
    }
    // Home Router
    app.get("/", (req, res) => {
        return res.json({ message: "⚙️ Server is Live... ✌" });
    })
    // App Routers
    routers(app)
    // Error Handling
    app.all("*", (req, res, next) => {
        return next(new Error(`In-Valid Routing ❗ => ${req.originalUrl}`, { cause: 404 }))
    })
    // Global Error Handling Middleware
    app.use(globalErrorHandler)
}
export default initApp;