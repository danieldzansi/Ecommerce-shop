import { v2 as cloudinary } from "cloudinary";
import { db,pool } from "../db/index.js";
import { products } from "../models/productModel.js";
import { eq } from "drizzle-orm";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, compareAtPrice, category, subCategory, sizes, variants, bestseller, onSale } = req.body;
    const productPrice = Number(price);
    const originalPrice = compareAtPrice ? Number(compareAtPrice) : null;
    const markedOnSale = onSale === "true";
    const isOnSale = markedOnSale || Boolean(originalPrice && originalPrice > productPrice);

    if (isOnSale && !originalPrice) {
      return res.json({ success: false, message: "Original price is required for sale products" });
    }

    if (originalPrice && originalPrice <= productPrice) {
      return res.json({ success: false, message: "Original price must be higher than the sale price" });
    }

    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    const sortByFieldName = (a, b) => a.fieldname.localeCompare(b.fieldname, undefined, { numeric: true });
    const baseImages = uploadedFiles
      .filter((file) => /^image[1-4]$/.test(file.fieldname))
      .sort(sortByFieldName);

    const imagesUrl = await Promise.all(
      baseImages.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const parsedSizes = sizes ? JSON.parse(sizes) : [];
    const parsedVariants = variants ? JSON.parse(variants) : [];
    const normalizedVariants = await Promise.all(
      parsedVariants
        .filter((variant) => variant?.colorName || variant?.colorValue)
        .map(async (variant, index) => {
          const variantFiles = uploadedFiles
            .filter((file) => file.fieldname.startsWith(`variant_${index}_image_`))
            .sort(sortByFieldName);

          const variantImages = await Promise.all(
            variantFiles.map(async (img) => {
              const result = await cloudinary.uploader.upload(img.path, { resource_type: "image" });
              return result.secure_url;
            })
          );

          return {
            colorName: String(variant.colorName || "").trim(),
            colorValue: String(variant.colorValue || "").trim(),
            sizes: Array.isArray(variant.sizes) ? variant.sizes.filter(Boolean) : parsedSizes,
            images: variantImages,
          };
        })
    );

    const productData = {
      name,
      description,
      category,
      price: productPrice,
      compareAtPrice: originalPrice,
      onSale: isOnSale,
      subCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      variants: normalizedVariants,
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
    const deleted = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (deleted.length === 0) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.json({ success: false, message: error.message });
  }
};


const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined') {
      return res.status(400).json({ success: false, message: "Product id is required" });
    }
    const [product] = await db.select().from(products).where(eq(products.id, id));

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};




export {listProduct,addProduct,removeProduct,singleProduct}
