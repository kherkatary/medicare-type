import jwt from 'jsonwebtoken'
import express from 'express'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
const requireSignIn = async (_req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        const decodedData = jwt.verify(_req.headers.authorization, process.env.SUPER_SECRET_KEY);
        _req.body.user = decodedData
        next();

    } catch (err) {
        return res.status(500).send({
            message: "Error token verification",
            error: err
        })
    }

}




export { requireSignIn }