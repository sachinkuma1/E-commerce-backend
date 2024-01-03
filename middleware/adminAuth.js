const asyncHandler = require("express-async-handler");

const adiminAuth=asyncHandler(async(req, res,next)=>{

    try {

        const {role}=req.user;
        if(role!=="Admin"){
            throw new Error("you are not admin");
        }

        next();
        
    } catch (error) {
        throw new Error(error);
    }
});

module.exports=adiminAuth;