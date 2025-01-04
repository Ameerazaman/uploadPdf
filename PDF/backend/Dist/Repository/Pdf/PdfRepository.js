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
exports.PdfRepository = void 0;
const PdfModel_1 = __importDefault(require("../../Model/PdfModel"));
const BaseRepository_1 = require("../BaseRepository");
class PdfRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(PdfModel_1.default);
    }
    // ************************upload pdf*************************
    uploadPdf(pdfUrl, userId, pdfName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pdfData = {
                    userId: userId,
                    pdfUrl: pdfUrl,
                    name: pdfName,
                };
                const result = yield this.model.create(pdfData);
                return result;
            }
            catch (error) {
                console.error("Error in uploadPdf repository:", error);
                return null;
            }
        });
    }
    // *********************fech pdfs*********************
    fetchPdf(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Correct the find query by passing the userId as a key-value pair inside an object
                const result = yield this.model.find({ userId: userId }); // Directly use the model for testing
                return result; // Ensure the result is of type IPdf[]
            }
            catch (error) {
                console.error("Error in uploadPdf repository:", error);
                return null;
            }
        });
    }
    // *********************fetch pdf details*****************
    getPdfById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findById(id);
                console.log(result);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.PdfRepository = PdfRepository;
