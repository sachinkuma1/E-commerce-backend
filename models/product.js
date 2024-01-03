const { string } = require('joi');
const mongoose= require('mongoose');
const schema=mongoose.Schema;

const productSchema= new schema({
   title:{type:String, required:true},
   price:{type:Number, required:true},
   description:{type:String, required:true}


}, {timestamps:true});

module.exports=mongoose.model('Product', productSchema, 'products');