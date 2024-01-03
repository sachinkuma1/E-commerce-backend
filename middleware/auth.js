const jwt=require('jsonwebtoken');
const asyncHandler = require("express-async-handler");


const auth = asyncHandler( async(req, res, next)=>{
   let authHeader=req.headers.authorization ;
  //  console.log(authHeader);
   if(!authHeader){
    throw new Error("send a header atleast")
   }

   const token=authHeader.split(' ')[1];

   try {
    const decode =  jwt.verify(token,process.env.SECRET_CODE);
      if(!decode){
        res.status(401);
        throw new Error("unauthorized")
      }
    
      const user={
        _id,
        role

      } = decode

      req.user=user;

      next();

    
   } catch (error) {
    throw new Error(error);
   }


})

module.exports=auth ; 