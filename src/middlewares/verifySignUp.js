import {ROLES} from '../models/Role'
import User from '../models/User'
import logger from '../libs/logger.js';

export const checkDuplicateUsernameOrEmail = async (req,res,next) => {
    
    const email = await User.findOne({email: req.body.email})

    if(email){
        logger.error(`el email ${email.email}, ya existe`,{ email: email.email})
        return res.status(400).json({message:'el email ya existe'})  
    } 
    next();
}

export const checkRoleExisted = (req,res,next) => {
    if(req.body.roles){
        for(let i = 0; i < req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                logger.error(`El rol ${req.body.roles[i]} No existe`,{ email: req.body.email})
                return res.status(400).json({
                    message: `Role ${req.body.roles[i]} does not exists`
                })
            }
        }  
    }
 
    next();
}