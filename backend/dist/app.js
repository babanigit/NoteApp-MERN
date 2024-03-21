"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = __importStar(require("http-errors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const noteRoutes_1 = __importDefault(require("./dRoutes/noteRoutes"));
const userRoutes_1 = __importDefault(require("./dRoutes/userRoutes"));
// import { requiresAuth } from "./middleware/auth";
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// import utilEnv from "./util/validateEnv";
// we initialize the session method before routes so that all routes can access the session functions
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || " ",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.DATABASE
    })
}));
// routes
app.use("/api/notes", noteRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.get("/", (req, res, next) => {
    try {
        res.status(200).json({
            message: "Express.js + Typescript server is live ",
        });
    }
    catch (error) {
        next(error);
    }
});
// end point middleware
app.use((res, req, next) => {
    // next(Error("endpoint not found"));
    next((0, http_errors_1.default)(404, "endpoint not found"));
});
// error handler middleware
app.use((error, req, res, next) => {
    console.error(error);
    let errorMessage = "an unknown error occurred";
    let statusCode = 500;
    // if (error instanceof Error) errorMessage = error.message;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;
