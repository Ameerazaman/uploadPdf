import { JwtPayload, Secret } from "jsonwebtoken"
import dotenv from 'dotenv';
const jwt = require('jsonwebtoken');
dotenv.config();

export class creatJWT {

    // Generate Aceess token
    generateToken(payload: string | undefined): string | undefined {
                if (payload) {
                    const token = jwt.sign({ data: payload }, process.env.JWT_SECRET as Secret, { expiresIn: '5m' });
                    return token;
                }
            }
    // Generate Refresh token

    generateRefreshToken(payload: string | undefined): string | undefined {
                return jwt.sign({ data: payload }, process.env.JWT_REFRESH_SECRET as Secret, { expiresIn: '48h' });
            }

}


