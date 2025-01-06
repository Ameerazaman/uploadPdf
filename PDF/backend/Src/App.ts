import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import connectDB from './Config/Db'
import cors from 'cors';
import userRouter from './Routes/UserRouter';
import createHttpError from 'http-errors';
import path from 'path';
import cookieParser from "cookie-parser";

dotenv.config()
connectDB()
const PORT = process.env.PORT || 3000;
const app = express()
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:3000","https://upload-pdf-5onx.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,

};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use("/api/user", userRouter);


// 404 Not Found Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404));
  });

// Error Handling Middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500).send({
      status: err.status || 500,
      message: err.message,
    });
  };
  app.use(errorHandler);
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });