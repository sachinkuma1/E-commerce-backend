const express= require('express');
const router=express.Router();
const auth =require('../middleware/auth');
const adiminAuth=require('../middleware/adminAuth');
const {getProducts, createProduct, getSingleProduct, getProductByTitle, updateController, deleteController}=require('../controller/products/productController');

router.get('/allProducts', getProducts);
router.post('/product',auth, adiminAuth, createProduct );
router.get('/:id/product', getSingleProduct);
router.get('/product', getProductByTitle);
router.put('/product/update', auth, adiminAuth, updateController );
router.delete('/:id/product/delete', auth , adiminAuth, deleteController);

module.exports=router;