import { timeStamp } from 'console'
import mongoose, { Document, Model } from 'mongoose'

export interface IPdf extends Document{
    pdfUrl:string,
    userId:string,
    createdAt?:Date,
    updatedAt?:Date,
    name:string
}
const pdfSchema = new mongoose.Schema({
    name:{
        type:String
    },
    pdfUrl: {
        type: String
    },
    userId: {
        type: String
    }

},{timestamps: true })

const PdfModel:Model<IPdf>=mongoose.model<IPdf>('PdfModel',pdfSchema)
export default PdfModel