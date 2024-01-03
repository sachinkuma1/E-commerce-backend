const router=require('express').Router();
const {register,login, usercontroller, userDeleteController, userUpdateController}=require('../controller/auth/Registercontroller');
const adiminAuth = require('../middleware/adminAuth');
const auth=require('../middleware/auth');

router.post('/register',register);
router.post('/login', login);
router.get('/me',auth, usercontroller);
router.put('/:id/user/update', auth, userUpdateController);
router.delete('/:id/user/delete',auth, adiminAuth, userDeleteController);

module.exports=router;
