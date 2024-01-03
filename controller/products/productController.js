const asyncHandler = require("express-async-handler");
const Product= require('../../models/product');
const Joi =require('joi');


const getProducts=asyncHandler(async(req, res)=>{
   try {

    const allProducts= await Product.find();
    if(( allProducts).length<1) {
        throw new Error("product not found");
    }

    res.json(allProducts);
    
   } catch (error) {

    throw new Error(error);
    
   }

})

const createProduct=asyncHandler(async(req, res)=>{
    // res.json({msg:"this is createproduct"});
  
    const productSchema=Joi.object({
        title:Joi.string().max(30).required(),
        price:Joi.number().required(),
       description:Joi.string().required(),
       
    });


    const {error}=productSchema.validate(req.body);
    if (error) {
        res.status(400);
       
        throw new Error(error.details[0].message);
      }

    const {title, price, description}=req.body;

      try {

        const isAvailableproduct= await Product.findOne({title:title});
        
       
        if(isAvailableproduct){
            throw new Error("product already exists");
        }

        
        const product= await Product.create({
            title,
            price,
            description
        })
       
        if(product){
            res.json(product);
        }
        
      } catch (error) {
        throw new Error(error);
      }

      


     
})

const getSingleProduct=asyncHandler(async(req, res)=>{
    
   const id=req.params.id;
   if(!id){
    throw new Error("send a valid id");
   }

   try {

    const singleProduct=await Product.findById(id);
    if(!singleProduct){
        throw new Error("this product is not found");
    }

    res.json(singleProduct);
    
   } catch (error) {
    throw new Error(error);
    
   }

     
})


const getProductByTitle=asyncHandler(async(req, res)=>{

    const {title}=req.query;
    if(!title){
        throw new Error("title is required");
    }
    try{

        const product= await Product.find({title:{ $regex: new RegExp(title, 'i') }});
        if(!product.length){
            throw new Error("no product is available with this title");
        }

        res.json(product);
    }
    catch(error){
        throw new Error(error);
    }

})

const updateController=asyncHandler(async(req, res)=>{
    const {id:_id, title, price, description}=req.body;
    
    if(!_id){
        throw new Error("send a valid id to update");
    }

    try {
        
        const updatedProduct=await Product.findByIdAndUpdate(_id,{
            title,
            price,
            description
        }, {new :true});
       
     if(!updatedProduct){
        throw new Error("something went wrong");
     }

     res.json(updatedProduct);

    } catch (error) {
        throw new Error(error);
        
    }

})

const deleteController=asyncHandler(async(req, res)=>{
    const {id:_id}=req.params;

    if(!_id){
        throw new Error("id not found ")
    }

    try {

        const deletedProduct=await Product.findByIdAndDelete(_id);
        if(!deletedProduct){
            throw new Error("there is some problem in deleting this content");
        }

        res.json({message:"product deleted succesfully"});
        
    } catch (error) {
        throw new Error(error);
    }

})



module.exports={getProducts, createProduct, getSingleProduct, getProductByTitle, updateController, deleteController};