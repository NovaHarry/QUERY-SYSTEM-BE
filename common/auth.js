const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const hashPassword = async (password)=>{
    let salt = await bcrypt.genSalt(saltRounds);
    let hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword
}

const hashCompare =  async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}

const createToken = async(payload)=>{
    let token = await jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'6h'})
    return token
}


module.exports = {hashPassword, hashCompare , createToken};