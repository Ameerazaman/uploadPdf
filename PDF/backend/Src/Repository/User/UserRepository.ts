import { IPdf } from "../../Model/PdfModel"
import UserModel, { IUser } from "../../Model/UserModel"
import { BaseRepository } from "../BaseRepository"
import { IUserRepository } from "./IUserRepository"



export class UserRepository extends BaseRepository<typeof UserModel> implements IUserRepository {
    constructor() {
        super(UserModel)
    }

    // **************check email exist or not********************

    async emailExistCheck(email: string): Promise<IUser | null> {
        try {
            console.log(email, "email fo check")
            const result = await this.model.findOne({ email: email })
            console.log(result)
            return result
        }
        catch (error) {
            return null
        }
    }
    // *******************create User********************
    async createUser(userData: IUser): Promise<IUser | null> {
        try {
            const result = await this.model.create(userData)
            return result
        }
        catch (error) {
            return null
        }
    }

    // ********************find user by Id**********************

    async getUserById(id: string): Promise<IUser | null> {
        try {
            console.log("get userby Id")
            const result = await this.model.findById(id)
            console.log(result)
            return result
        }
        catch (error) {
            return null
        }
    }



}