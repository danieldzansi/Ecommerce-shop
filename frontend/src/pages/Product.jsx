import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";
import { useCartStore } from "../store/CartStore";
import AssetImage from "../components/AssetImage";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, backend_url } = useContext(ShopContext);
  const addToCart = useCartStore((state) => state.addToCart);
  const [size, setSize] = useState("");
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setImage(selectedProduct.image[0]);
      return;
    }
    const fetchSingle = async () => {
      try {
        const resp = await axios.get(
          `${backend_url}/api/product/single/${productId}`
        );
        if (resp.data?.success && resp.data.product) {
          setProductData(resp.data.product);
          setImage(resp.data.product.image?.[0] ?? "");
        }
      } catch (err) {
        console.error(
          "Failed to fetch single product:",
          err?.response?.data || err.message
        );
      }
    };

    fetchSingle();
  }, [productId, products, backend_url]);

  if (!productData) return <div className="opacity-0"></div>;

  return (
    <section className="page-x section-y transition-opacity ease-in duration-100">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
     
        <div className="flex gap-4">
          <div className="flex w-20 shrink-0 flex-col gap-3 overflow-y-auto">
            {productData.image.map((img, index) => (
              <AssetImage
                key={index}
                asset={img}
                onClick={() => setImage(img)}
                alt={`${productData.name} thumbnail ${index + 1}`}
                className="aspect-[3/4] w-20 cursor-pointer border border-[#DBCCB7] object-cover hover:border-[#5A0019]"
              />
            ))}
          </div>

          <AssetImage
            asset={image}
            alt={productData.name}
            className="min-h-[520px] flex-1 bg-white object-cover"
          />
        </div>

    
        <div>
          <p className="eyebrow">{productData.category}</p>
          <h1 className="editorial-serif mt-3 text-4xl font-semibold leading-tight md:text-5xl">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            <AssetImage asset={assets.star_icon} className="w-4 text-yellow-500" alt="Rating star" />
            <AssetImage asset={assets.star_icon} className="w-4 text-yellow-500" alt="Rating star" />
            <AssetImage asset={assets.star_icon} className="w-4 text-yellow-500" alt="Rating star" />
            <AssetImage asset={assets.star_icon} className="w-4 text-yellow-500" alt="Rating star" />
            <AssetImage asset={assets.star_dull_icon} className="w-4 text-yellow-500" alt="Empty rating star" />
            <span className="ml-2 text-sm text-[#6f5860]">122 reviews</span>
          </div>

          <p className="mt-6 text-2xl font-bold">
            {currency}
            {productData.price}
          </p>

          <p className="mt-5 leading-7 text-[#6f5860]">{productData.description}</p>

          <div className="flex flex-col gap-4 my-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em]">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`min-w-12 border px-4 py-3 text-sm font-semibold ${
                    item === size ? "border-[#5A0019] bg-[#5A0019] text-white" : "border-[#DBCCB7] bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={() => addToCart(productData._id, size)}
              className="btn-primary w-full sm:w-auto"
            >
              Add to cart
            </button>
            <hr className="mt-6 border-[#DBCCB7]/60" />
            <div className="grid gap-3 text-sm text-[#6f5860]">
              <p>Curated quality, selected for everyday polish.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange support within 7 days.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 border-t border-[#DBCCB7]/60 pt-10">
        <div className="flex gap-8 border-b border-[#DBCCB7]/60">
          <button
            className={`pb-2 ${
              activeTab === "description"
                ? "border-b-2 border-[#5A0019] font-medium text-[#5A0019]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("description")}
          >
            {" "}
            Description
          </button>
          <button
            className={`pb-2 ${
              activeTab === "reviews"
                ? "border-b-2 border-[#5A0019] font-medium text-[#5A0019]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews (122){" "}
          </button>
        </div>

        {activeTab === "description" && (
          <div className="mt-6 max-w-3xl text-[#6f5860] leading-7">
            <p>
              Designed to bring a finished feeling to your wardrobe without overthinking it.
              Style it simply, wear it often, and let the detail do the work.
            </p>
            <p className="mt-3">
              Each item in the edit is selected for ease, versatility, and the kind of polish
              that moves from daytime plans to evening moments.
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-5 text-gray-600">
            <p>No reviews yet. Be the first to review this product.</p>
          </div>
        )}
      </div>

      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </section>
  );
};

export default Product;
