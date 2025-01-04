"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: 'daolqrbp2',
    api_key: '275178154791847',
    api_secret: 'VtY5UFLU8R3fJWMlZ7PGyOm-weE' // Click 'View API Keys' above to copy your API secret
});
exports.default = cloudinary_1.v2;
