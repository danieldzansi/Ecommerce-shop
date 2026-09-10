import express from 'express'

import { listProduct,addProduct,removeProduct,singleProduct } from '../controllers/productcontroller.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminauth.js'


const productRouter =express.Router()


productRouter.post ('/add',adminAuth,upload.any(),addProduct)
productRouter.post ('/remove',adminAuth,removeProduct)
productRouter.get("/single/:id", singleProduct);
productRouter.get('/list', listProduct);



export default productRouter

