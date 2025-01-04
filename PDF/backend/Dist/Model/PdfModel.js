"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pdfSchema = new mongoose_1.default.Schema({
    name: {
        type: String
    },
    pdfUrl: {
        type: String
    },
    userId: {
        type: String
    }
}, { timestamps: true });
const PdfModel = mongoose_1.default.model('PdfModel', pdfSchema);
exports.default = PdfModel;
