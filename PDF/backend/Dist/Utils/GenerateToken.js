"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creatJWT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = require('jsonwebtoken');
dotenv_1.default.config();
class creatJWT {
    // Generate Aceess token
    generateToken(payload) {
        if (payload) {
            const token = jwt.sign({ data: payload }, process.env.JWT_SECRET, { expiresIn: '5m' });
            return token;
        }
    }
    // Generate Refresh token
    generateRefreshToken(payload) {
        return jwt.sign({ data: payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: '48h' });
    }
}
exports.creatJWT = creatJWT;
