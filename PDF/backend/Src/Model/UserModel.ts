import mongoose, { Model, StringExpression }  from "mongoose";

export interface IUser extends Document{
    id?:string
    email:string,
    password:string,
    username:string,
    createdAt?:Date,
    updatedAt?:Date
}
const userSchema=new mongoose.Schema({
    email:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    }
},{timestamps:true})

const UserModel :Model<IUser>=mongoose.model<IUser>('UserModel',userSchema)

export default UserModel