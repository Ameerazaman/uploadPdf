"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Db_1 = __importDefault(require("./Config/Db"));
const cors_1 = __importDefault(require("cors"));
const UserRouter_1 = __importDefault(require("./Routes/UserRouter"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
(0, Db_1.default)();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Routes
app.use("/api/user", UserRouter_1.default);
// 404 Not Found Middleware
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).send({
        status: err.status || 500,
        message: err.message,
    });
};
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
