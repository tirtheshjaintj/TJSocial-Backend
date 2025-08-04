import "dotenv/config";
import express from "express";
import homeRouter from "./routes";
import { errorHandler } from "./helpers/error.helper";
import cors, { CorsOptions } from "cors";
import connectDB from "./helpers/db.helper";
import cookieParser from "cookie-parser";
const app = express();
connectDB();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

//All Routes
app.use("/api", homeRouter);

//Error Handling Using Express-AsyncHandler
app.use(errorHandler);



app.listen(8000, () => {
    console.log("Running at http://localhost:8000");
});
