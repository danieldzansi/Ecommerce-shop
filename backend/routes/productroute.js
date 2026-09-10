import express from 'express'

import { listProduct,addProduct,removeProduct,singleProduct,updateProduct } from '../controllers/productcontroller.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminauth.js'


const productRouter =express.Router()


productRouter.post ('/add',adminAuth,upload.any(),addProduct)
productRouter.put ('/update/:id',adminAuth,updateProduct)
productRouter.post ('/remove',adminAuth,removeProduct)
productRouter.get("/single/:id", singleProduct);
productRouter.get('/list', listProduct);



export default productRouter
