import { v2 as cloudinary } from "cloudinary";
import { db,pool } from "../db/index.js";
import { products } from "../models/productModel.js";
import { eq } from "drizzle-orm";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter((img) => img !== undefined);

    const imagesUrl = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

   
    const result = await db.insert(products).values(productData).returning();

    res.json({ success: true, message: "Product Added", product: result[0] });
  } catch (error) {
    console.error("Error:", error);
    res.json({ success: false, message: error.message });
  }
};





const listProduct =async (req,res)=>{
    try {
        const allproducts= await db.select().from(products)
        res.json ({success:true,allproducts})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;  
    
    await db.delete(products).where(eq(products.id, id));
    
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct =async (req,res)=>{

    try {
        const { id } = req.body;  
    
    const product= db.find(products).where(eq(products.id, id));
    
    res.json({ success: true, message: "product found "});
    } catch (error) {
        
    }

}


export {listProduct,addProduct,removeProduct,singleProduct}
