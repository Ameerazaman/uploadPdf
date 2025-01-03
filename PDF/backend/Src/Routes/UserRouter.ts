import express, { Router } from "express";
import { UserRepository } from "../Repository/User/UserRepository";
import { UserServices } from "../Services/User/UserServices";
import { UserController } from "../Controller/UserController";
import Encrypt from "../Utils/ComparedPassword";
import { creatJWT } from "../Utils/GenerateToken";
import upload from "../Middlewares/Multer";
import { PdfRepository } from "../Repository/Pdf/PdfRepository";
import userAuth from "../Middlewares/UserAuthentication";

const userRouter: Router = express.Router()

const userRepository = new UserRepository()
const encrypt = new Encrypt()
const creatjwt = new creatJWT()
const pdfRepository = new PdfRepository()
const userServices = new UserServices(
    userRepository,
    pdfRepository,
    encrypt,
    creatjwt
)

const userController = new UserController(userServices)

userRouter.post('/signup', (req, res) => userController.userSignup(req, res))
userRouter.post('/login', (req, res) => userController.userLogin(req, res))
userRouter.get('/logout', (req, res) => userController.userLogout(req, res))
userRouter.get('/refersh_access_token', (req, res, next) => userController.refreshToken(req, res, next))
userRouter.post('/upload_pdf', userAuth, upload.single('pdf'), async (req, res) => userController.uploadPdf(req, res));
userRouter.get('/fetch_pdf', userAuth, async (req, res) => userController.fetchPdf(req, res));
userRouter.get('/pdf_details', userAuth, async (req, res) => userController.getPdfById(req, res));
userRouter.post('/create_new_pdf',userAuth,async(req,res)=>userController.createPdf(req,res))

export default userRouter