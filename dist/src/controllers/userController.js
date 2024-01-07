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
exports.verifyEmail = exports.protectedRoute = exports.Login = exports.Register = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const auth_1 = require("../helper/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Register = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = _req.body;
    const auth_mail = process.env.AUTH_MAIL;
    const auth_pass = process.env.AUTH_pass;
    if (!name)
        return res.status(400).send({ message: "Name required" });
    if (!email)
        return res.status(400).send({ message: "email required" });
    if (!password)
        return res.status(400).send({ message: "Password required" });
    try {
        const existingUser = yield userModel_1.default.findOne({ email: email });
        if (existingUser)
            return res.status(201).send({ message: "Existing user, please login" });
        const hasedPassword = yield (0, auth_1.hashingPassword)(password);
        const rand = crypto_1.default.randomBytes(10).toString('hex');
        const user = yield new userModel_1.default({ name: name, password: hasedPassword, email: email, mailCrypto: rand }).save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: email }, process.env.SUPER_SECRET_KEY, { expiresIn: "7d" });
        console.log(1);
        const transporter = yield nodemailer_1.default.createTransport({
            service: 'outlook',
            auth: {
                user: 'sandeepkherkatary123@outlook.com',
                pass: 'Sandeep2000@'
            }
        });
        const mail = {
            from: 'sandeepkherkatary123@outlook.com',
            to: email,
            subject: " Verify Your Email",
            text: `Hi! There, You have recently visited  
        our website and entered your email. 
        Please follow the given link to verify your email 
        http://localhost:8080/api/v1/auth/verify/${user._id}/${rand}  
        Thanks`
        };
        console.log(1);
        yield transporter.sendMail(mail, (err, info) => {
            console.log(1);
            if (err)
                return res.status(500).send({ message: "error sending email", error: err });
            else {
                console.log(`successfully mail sent: ${info}`);
            }
        });
        return res.status(200).send({
            message: "User Created",
        });
    }
    catch (err) {
        return res.status(500).send({
            message: "Error registering",
            error: err
        });
    }
});
exports.Register = Register;
const Login = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = _req.body;
    if (!password)
        return res.status(400).send({ message: "password required" });
    if (!email)
        return res.status(400).send({ message: "Name required" });
    try {
        const user = yield userModel_1.default.findOne({ email: email });
        if (!user)
            return res.status(400).send({ message: "User not found, please register first" });
        const compare = yield (0, auth_1.passwordCompare)(password, user.password);
        if (!compare)
            return res.status(400).send({ message: "Password incorrect" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.SUPER_SECRET_KEY, { expiresIn: '7d' });
        return res.status(200).send({
            message: "Login successfull",
            name: user.name,
            email: user.email,
            token: token
        });
    }
    catch (err) {
        return res.status(500).send({ message: "Error Logging in", error: err });
    }
});
exports.Login = Login;
const protectedRoute = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("Hello i am a protected route");
});
exports.protectedRoute = protectedRoute;
const verifyEmail = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = _req.params.id;
    const verfiedCrypto = _req.params.slug;
    try {
        const user = yield userModel_1.default.findById(id);
        if (!user)
            return res.status(500).send("Couldnt find User");
        if (verfiedCrypto != user.mailCrypto) {
            yield userModel_1.default.findByIdAndDelete(id, (err, data) => {
                if (!err)
                    return res.status(500).send({
                        message: "Token unmatched, User deleted",
                    });
            });
            return res.status(300).send("Verification failed, token unmatched");
        }
        const newUpdate = yield userModel_1.default.findByIdAndUpdate(id, { isMailVerified: true });
        return res.status(200).send("Email Verified, thank you");
    }
    catch (err) {
        return res.status(500).send({
            message: "Error email verification process",
            error: err
        });
    }
});
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=userController.js.map