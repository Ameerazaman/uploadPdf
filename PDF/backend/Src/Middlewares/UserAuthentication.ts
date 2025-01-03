import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import { creatJWT } from '../Utils/GenerateToken';
import { verifyRefreshToken, verifyAccessToken } from '../Utils/VerifyTokens';
import { STATUS_CODES } from '../Constants/HttpStatusCode';
import { UserRepository } from '../Repository/User/UserRepository';
import { IUser } from '../Model/UserModel';

const { UNAUTHORIZED } = STATUS_CODES

const jwt = new creatJWT();
const userRepository = new UserRepository();
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}


const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let token = req.cookies.access_token;

        let refresh_token = req.cookies.refresh_token;

        if (!refresh_token) {
        
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }
        const refreshTokenValid = verifyRefreshToken(refresh_token);
       
        if (refreshTokenValid) {
            console.log(refreshTokenValid.data, "refreshTokenValid")
            const decoded = verifyAccessToken(token);

            if (!decoded?.data) {
                return res.status(401).json({ success: false, message: "Access Token Expired" });
            }
            const existingUser = await userRepository.getUserById(decoded.data);
            
            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }
            else {
                req.user = existingUser;
                next();
            }
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default userAuth;