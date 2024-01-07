"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const userRouter = (0, express_1.Router)();
userRouter.post('/login', userController_1.Login);
userRouter.post('/register', userController_1.Register);
userRouter.post('/protected', auth_1.requireSignIn, userController_1.protectedRoute);
userRouter.get('/verify/:id/:slug', userController_1.verifyEmail);
exports.default = userRouter;
//# sourceMappingURL=userRoute.js.map