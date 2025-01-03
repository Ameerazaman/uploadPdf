import { ObjectId } from "mongoose"
import { IUser } from "../Model/UserModel"

export interface UserAuthResponse{
   status:number,
   data:{
    success:boolean,
    data?:IUser,
    token?:string,
    refreshToken?:string,
    userId?:string,
    message?:string
   }
}