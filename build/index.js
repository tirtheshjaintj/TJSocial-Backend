"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const error_helper_1 = require("./helpers/error.helper");
const cors_1 = __importDefault(require("cors"));
const db_helper_1 = __importDefault(require("./helpers/db.helper"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
(0, db_helper_1.default)();
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
//All Routes
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World");
});
//Error Handling Using Express-AsyncHandler
app.use(error_helper_1.errorHandler);
app.listen(8000, () => {
    console.log("Running at http://localhost:8000");
});
