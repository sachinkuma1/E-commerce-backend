const Joi=require('joi');
const asyncHandler = require("express-async-handler");
const User=require('../../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const user = require('../../models/user');
const { findByIdAndUpdate } = require('../../models/product');


const register = asyncHandler(async (req, res) => {
    // const { name,email,password,reapeat_password } = req.body;
   
    const registerSchema=Joi.object({
        name:Joi.string().min(3).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
       
        repeat_password:Joi.ref('password')
    });

    const {error}=registerSchema.validate(req.body);
    if (error) {
        res.status(400);
       
        throw new Error(error.details[0].message);
      }

      // checking for already registered user
      const {name, email, password}=req.body;

      try{
        
        const exist=await User.exists({email:email});
        if(exist){
    

        throw new Error("user already exist");
        }
      }catch(err){
      
        
        throw new Error(err.message);
         
      }

      // hashed password
      const hashedPassword= await bcrypt.hash(password, 10);

      const user=new User({
        name, 
        email,
        password:hashedPassword
      })

      let accessToken;

     try {
        var result= await user.save();
    
      accessToken=jwt.sign({
        _id:result._id,
        role:result.role
      },process.env.SECRET_CODE, {expiresIn:'60s'})



     } catch (error) {
        throw new Error(error);
     }


      
    
      res.json({name: result.name,accessToken});
})  



const login  = asyncHandler(async(req,res)=>{
      const loginSchema=Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });

    const {error}=loginSchema.validate(req.body);

    if(error){
        throw new Error(error);
    }
    let user;
    try {
        
         user=await User.findOne({email:req.body.email});
         
        if(!user){
            throw new Error("this email does not exist");

            // compare the password
          
        }
        const match=await bcrypt.compare(req.body.password, user.password);
            if(!match){
                throw new Error("the password doesn't match");
            } 
    } catch (err) {
        throw new Error(err);
        
    }

   const accessToken=jwt.sign({_id:user._id, role:user.role}, process.env.SECRET_CODE,  { expiresIn: "1d" });

   res.json(accessToken);

})


const usercontroller=asyncHandler(async(req, res)=>{

  try {
    
    const user= await User.findOne({_id:req.user._id}).select("-password");
    
    if(!user){
      res.status(404);
      throw new Error ("user not found");
    }

     res.json(user);
    
  } catch (error) {

    throw new Error(error);
    
  }

})

const userUpdateController=asyncHandler(async(req, res)=>{
  const {id:_id}=req.params;
  if(!_id){
    throw new Error("send a valid id to update the user");
  }

  try {
   
    const {name, email, password}=req.body;
    const updatedUser= await User.findByIdAndUpdate(_id, {
      name, 
      email,
     
    },{new:true})

    if(!updatedUser){
      throw new Error("there is some problem is updating the user");
    }

    res.json(updatedUser);

    
  } catch (error) {
    throw new Error(error);
    
  }


})

const userDeleteController=asyncHandler(async(req, res)=>{

 const {id:_id} =req.params;

  if(!_id){
    throw new Error("user id is required");
  }

  try {
    
    const deletedUser=await User.findByIdAndDelete(_id);
    if(!deletedUser){
      throw new Error("someting went wrong in deleting the user");
    }
  res.json("user deleted successfully");

  } catch (error) {
    throw new Error(error);
  }

})

module.exports={register,login, usercontroller, userDeleteController, userUpdateController};