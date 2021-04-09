const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauce.controllers');
const authMiddleware = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//routes GET
router.get('/:id', authMiddleware, saucesCtrl.getOneSauce);
router.get('/', authMiddleware, saucesCtrl.getAllSauces); 


//routes POST
router.post('/', authMiddleware, multer, saucesCtrl.createSauce);
router.post('/:id/like', authMiddleware, saucesCtrl.likeSauce)


//routes PUT
router.put('/:id', authMiddleware, multer, saucesCtrl.modifySauce);


//routes DELETE
router.delete('/:id', authMiddleware, saucesCtrl.deleteSauce);


module.exports = router;
