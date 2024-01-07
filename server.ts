import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDb from './config/db'
import userRouter from './src/routes/userRoute'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
const app = express()

//mmiddleswares
dotenv.config()
connectDb()
app.use(express.json());
app.use(morgan('tiny'));

//routes
app.use('/api/v1/auth/', userRouter);
app.get('/', (req, res) => {
    res.send("Hello Typescript");
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Running on port:${process.env.PORT} `);
})