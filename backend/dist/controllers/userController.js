"use strict";
// all the functionality will come here
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
exports.getLogin = exports.getRegister = exports.getLogout = exports.getAuthenticatedUser = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getAuthenticatedUserId = req.session.userId;
    try {
        // assertIsDefine(getAuthenticatedUserId);
        // if (!getAuthenticatedUserId) {
        //   throw createHttpError(401, "user is not authenticated -b");
        // }
        // // because of session.userId will get the data of user which was stored in cookie because of login and reg
        // const user = await User.findById(
        //   req.session.userId
        // ).select("+email").exec();
        const user = yield userSchema_1.default.findById(req.session.userId).select("+email").exec();
        console.log("session is ", req.session.userId);
        console.log("getAuth from userController ", user);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
        console.log("error from contoller/getAuth");
        console.error(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const getRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, passwd } = yield req.body;
        if (!userName || !email || !passwd) {
            throw (0, http_errors_1.default)(400, "parameters missing");
        }
        else {
            // const userExist= await User.findOne({email:email});
            const existingUserEmail = yield userSchema_1.default.findOne({ email: email });
            if (existingUserEmail) {
                throw (0, http_errors_1.default)(409, "email is already taken!");
            }
            const existingUserUserName = yield userSchema_1.default.findOne({ userName: userName });
            if (existingUserUserName) {
                throw (0, http_errors_1.default)(409, "username is already taken!");
            }
            else {
                // password hashing
                const hashedPasswd = yield bcrypt_1.default.hash(passwd, 10);
                const user = yield userSchema_1.default.create({
                    userName,
                    email,
                    passwd: hashedPasswd,
                    // cPasswd: hashedPasswd,
                });
                // we sending user._id to the session.userId
                req.session.userId = user._id;
                console.log("session is ", req.session.userId);
                console.log("getReg from userController", user);
                res.status(200).json(user);
            }
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.getRegister = getRegister;
const getLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const userName = req.body.userName;
    // const passwd = req.body.passwd;
    const { userName, passwd } = yield req.body;
    // throw createHttpError(404,"random errrorjorrro")
    console.log("getLogin from userController ", userName, passwd);
    try {
        if (!userName || !passwd) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        else {
            const user = yield userSchema_1.default.findOne({ userName: userName }).select("+passwd +email").exec();
            if (!user) {
                throw (0, http_errors_1.default)(401, "invalid credentials");
            }
            if (typeof passwd !== 'string' || typeof user.passwd !== 'string') {
                throw new Error("Password or user password is not a string");
            }
            console.log("user.pass", passwd, user.passwd);
            const passwdMatch = yield bcrypt_1.default.compare(passwd, user.passwd);
            if (!passwdMatch) {
                throw (0, http_errors_1.default)(401, "invalid credentials");
            }
            // we sending user._id to the session.userId
            req.session.userId = user._id;
            console.log("session is ", req.session.userId);
            console.log("getLog from userController  ", user);
            res.status(200).json(user);
        }
    }
    catch (error) {
        next(error);
        console.error(error);
    }
});
exports.getLogin = getLogin;
// logout
const getLogout = (req, res, next) => {
    // will destroy the session here....
    req.session.destroy(error => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
};
exports.getLogout = getLogout;
