import bycrypt from 'bcrypt'

interface compareInterface{
   compare( password:string, hashedPassword:string):Promise<boolean>
}

class Encrypt implements compareInterface{
    async compare(password:string,hashedPassword:string):Promise<boolean>{
        return await bycrypt.compare(password,hashedPassword)
    }
    async hashPassword(password:string):Promise<string>{
        const salt =await bycrypt.genSalt(10)
        return await bycrypt.hash(password,salt)
    }
}

export default Encrypt