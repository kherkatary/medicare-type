"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoute_1 = __importDefault(require("./src/routes/userRoute"));
const app = (0, express_1.default)();
//mmiddleswares
dotenv_1.default.config();
(0, db_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('tiny'));
//routes
app.use('/api/v1/auth/', userRoute_1.default);
app.get('/', (req, res) => {
    res.send("Hello Typescript");
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Running on port:${process.env.PORT} `);
});
//# sourceMappingURL=server.js.map