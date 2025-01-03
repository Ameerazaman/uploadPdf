import { IPdf } from "../../Model/PdfModel";
import { IUser } from "../../Model/UserModel";


export interface IUserRepository {
    emailExistCheck(email: string): Promise<IUser | null>
    createUser(userData: IUser): Promise<IUser | null>
    getUserById(id:string):Promise<IUser |null>
}