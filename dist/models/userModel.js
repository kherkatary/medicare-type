"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    mailCrypto: {
        type: String,
        require: true
    },
    isMailVerified: {
        type: Boolean,
        defaultValue: false
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('users', userSchema);
//# sourceMappingURL=userModel.js.map