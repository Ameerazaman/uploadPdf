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
const express_1 = __importDefault(require("express"));
const UserRepository_1 = require("../Repository/User/UserRepository");
const UserServices_1 = require("../Services/User/UserServices");
const UserController_1 = require("../Controller/UserController");
const ComparedPassword_1 = __importDefault(require("../Utils/ComparedPassword"));
const GenerateToken_1 = require("../Utils/GenerateToken");
const Multer_1 = __importDefault(require("../Middlewares/Multer"));
const PdfRepository_1 = require("../Repository/Pdf/PdfRepository");
const UserAuthentication_1 = __importDefault(require("../Middlewares/UserAuthentication"));
const userRouter = express_1.default.Router();
const userRepository = new UserRepository_1.UserRepository();
const encrypt = new ComparedPassword_1.default();
const creatjwt = new GenerateToken_1.creatJWT();
const pdfRepository = new PdfRepository_1.PdfRepository();
const userServices = new UserServices_1.UserServices(userRepository, pdfRepository, encrypt, creatjwt);
const userController = new UserController_1.UserController(userServices);
userRouter.post('/signup', (req, res) => userController.userSignup(req, res));
userRouter.post('/login', (req, res) => userController.userLogin(req, res));
userRouter.get('/logout', (req, res) => userController.userLogout(req, res));
userRouter.get('/refersh_access_token', (req, res, next) => userController.refreshToken(req, res, next));
userRouter.post('/upload_pdf', UserAuthentication_1.default, Multer_1.default.single('pdf'), (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.uploadPdf(req, res); }));
userRouter.get('/fetch_pdf', UserAuthentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.fetchPdf(req, res); }));
userRouter.get('/pdf_details', UserAuthentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.getPdfById(req, res); }));
userRouter.post('/create_new_pdf', UserAuthentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.createPdf(req, res); }));
exports.default = userRouter;
