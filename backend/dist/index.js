"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT;
const DB = process.env.DATABASE;
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!DB) {
        throw new Error("Database connection string is not provided. -b");
    }
    try {
        const connect = yield mongoose_1.default.connect(DB);
        console.log("database connected: ", connect.connection.host, connect.connection.name);
    }
    catch (error) {
        console.error("failed to connect to the database");
        console.error(error);
    }
});
connectDb();
app_1.default.listen(port, () => {
    console.log(`[server]: hello, Server is running at http://localhost:${port}`);
});
