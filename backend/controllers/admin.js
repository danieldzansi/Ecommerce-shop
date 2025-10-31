import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const createToken =(id)=>{
    return jwt,sign({id},process.env.JWT_SECRET)
}

const adminLogin =async (req,res)=>{
    try {
        
    } catch (error) {
        
    }

}


export default adminLogin