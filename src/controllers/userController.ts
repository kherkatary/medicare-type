import userModel from "../../models/userModel";
import express from 'express'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { hashingPassword, passwordCompare } from "../helper/auth";
import jwt from 'jsonwebtoken'
const Register = async (_req: express.Request, res: express.Response): Promise<express.Response> => {
    const { name, email, password } = _req.body;
    const auth_mail: string = process.env.AUTH_MAIL;
    const auth_pass: string = process.env.AUTH_pass

    if (!name) return res.status(400).send({ message: "Name required" });
    if (!email) return res.status(400).send({ message: "email required" });
    if (!password) return res.status(400).send({ message: "Password required" });

    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) return res.status(201).send({ message: "Existing user, please login" })

        const hasedPassword = await hashingPassword(password);
        const rand = crypto.randomBytes(10).toString('hex');
        const user = await new userModel({ name: name, password: hasedPassword, email: email, mailCrypto: rand }).save();
        const token = jwt.sign({ id: user._id, email: email }, process.env.SUPER_SECRET_KEY, { expiresIn: "7d" });

        console.log(1);
        const transporter = await nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'sandeepkherkatary123@outlook.com',
                pass: 'Sandeep2000@'
            }
        })

        const mail = {
            from: 'sandeepkherkatary123@outlook.com',
            to: email,
            subject: " Verify Your Email",
            text: `Hi! There, You have recently visited  
        our website and entered your email. 
        Please follow the given link to verify your email 
        http://localhost:8080/api/v1/auth/verify/${user._id}/${rand}  
        Thanks`
        }


        console.log(1);
        await transporter.sendMail(mail, (err: string, info: string) => {
            console.log(1);
            if (err) return res.status(500).send({ message: "error sending email", error: err });

            else {
                console.log(`successfully mail sent: ${info}`)
            }
        })



        return res.status(200).send({
            message: "User Created",
        })

    } catch (err) {
        return res.status(500).send({
            message: "Error registering",
            error: err
        })
    }
}

const Login = async (_req: express.Request, res: express.Response): Promise<express.Response> => {
    const { email, password } = _req.body;

    if (!password) return res.status(400).send({ message: "password required" });
    if (!email) return res.status(400).send({ message: "Name required" });

    try {
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(400).send({ message: "User not found, please register first" });

        const compare = await passwordCompare(password, user.password);
        if (!compare) return res.status(400).send({ message: "Password incorrect" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SUPER_SECRET_KEY, { expiresIn: '7d' })

        return res.status(200).send({
            message: "Login successfull",
            name: user.name,
            email: user.email,
            token: token
        })

    }
    catch (err) {
        return res.status(500).send({ message: "Error Logging in", error: err })
    }

}

const protectedRoute = async (_req: express.Request, res: express.Response) => {
    return res.send("Hello i am a protected route")
}

const verifyEmail = async (_req: express.Request, res: express.Response) => {
    const id = _req.params.id;
    const verfiedCrypto = _req.params.slug;

    try {

        const user = await userModel.findById(id);
        if (!user) return res.status(500).send("Couldnt find User");

        if (verfiedCrypto != user.mailCrypto) {
            await userModel.findByIdAndDelete(id, (err, data) => {
                if (!err) return res.status(500).send({
                    message: "Token unmatched, User deleted",
                })
            })
            return res.status(300).send("Verification failed, token unmatched");
        }
        const newUpdate = await userModel.findByIdAndUpdate(id, { isMailVerified: true })
        return res.status(200).send("Email Verified, thank you");

    } catch (err) {
        return res.status(500).send({
            message: "Error email verification process",
            error: err
        })
    }


}

export { Register, Login, protectedRoute, verifyEmail }