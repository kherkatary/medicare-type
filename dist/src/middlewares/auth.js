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
exports.requireSignIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireSignIn = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedData = jsonwebtoken_1.default.verify(_req.headers.authorization, process.env.SUPER_SECRET_KEY);
        _req.body.user = decodedData;
        next();
    }
    catch (err) {
        return res.status(500).send({
            message: "Error token verification",
            error: err
        });
    }
});
exports.requireSignIn = requireSignIn;
//# sourceMappingURL=auth.js.map