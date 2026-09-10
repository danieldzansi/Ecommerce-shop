import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import RelatedProduct from "../components/RelatedProduct";
import { useCartStore } from "../store/CartStore";
import AssetImage from "../components/AssetImage";

const getProductVariants = (product) =>
  Array.isArray(product?.variants)
    ? product.variants.filter((variant) => variant?.colorName || variant?.colorValue)
    : [];

const getInitialProductImage = (product) => {
  const firstVariant = getProductVariants(product)[0];
  return firstVariant?.images?.[0] || product?.image?.[0] || "";
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, backend_url } = useContext(ShopContext);
  const addToCart = useCartStore((state) => state.addToCart);
  const [size, setSize] = useState("");
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const mainImageRef = useRef(null);

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setSelectedVariantIndex(0);
      setSize("");
      setImage(getInitialProductImage(selectedProduct));
      return;
    }
    const fetchSingle = async () => {
      try {
        const resp = await axios.get(
          `${backend_url}/api/product/single/${productId}`
        );
        if (resp.data?.success && resp.data.product) {
          setProductData(resp.data.product);
          setSelectedVariantIndex(0);
          setSize("");
          setImage(getInitialProductImage(resp.data.product));
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

  useLayoutEffect(() => {
    const target = mainImageRef.current
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let ctx
    let isMounted = true

    import('gsap').then((gsapModule) => {
      if (!isMounted) return
      const gsap = gsapModule.gsap || gsapModule.default
      ctx = gsap.context(() => {
        gsap.fromTo(target, { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.38, ease: 'power2.out' })
      })
    })

    return () => {
      isMounted = false
      ctx?.revert()
    }
  }, [image]);

  if (!productData) return <div className="opacity-0"></div>;

  const productVariants = getProductVariants(productData);
  const selectedVariant = productVariants[selectedVariantIndex] || null;
  const activeImages = selectedVariant?.images?.length ? selectedVariant.images : productData.image || [];
  const numericPrice = Number(productData.price || 0);
  const numericCompareAtPrice = Number(productData.compareAtPrice || 0);
  const hasSalePrice = (productData.onSale === true || productData.onSale === "true" || numericCompareAtPrice > numericPrice) && numericCompareAtPrice > numericPrice;
  const discountPercent = hasSalePrice ? Math.round(((numericCompareAtPrice - numericPrice) / numericCompareAtPrice) * 100) : 0;
  const productSizes = Array.isArray(selectedVariant?.sizes) && selectedVariant.sizes.length > 0
    ? selectedVariant.sizes.filter(Boolean)
    : Array.isArray(productData.sizes)
      ? productData.sizes.filter(Boolean)
      : [];
  const requiresSize = productSizes.length > 0;
  const requiresColor = productVariants.length > 0;

  const selectVariant = (variant, index) => {
    setSelectedVariantIndex(index);
    setImage(variant.images?.[0] || productData.image?.[0] || "");
    setSize("");
  };

  return (
    <section className="page-x section-y transition-opacity ease-in duration-100">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
     
        <div className="grid min-w-0 gap-4 sm:grid-cols-[80px_minmax(0,1fr)]">
          <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:shrink-0 sm:flex-col sm:overflow-y-auto">
            {activeImages.map((img, index) => (
              <AssetImage
                key={index}
                asset={img}
                onClick={() => setImage(img)}
                alt={`${productData.name} thumbnail ${index + 1}`}
                className="aspect-[3/4] w-20 shrink-0 cursor-pointer border border-[#DBCCB7] object-cover hover:border-[#5A0019]"
              />
            ))}
          </div>

          <div className="order-1 min-w-0 overflow-hidden bg-white sm:order-2">
            <AssetImage
              ref={mainImageRef}
              asset={image}
              alt={productData.name}
              className="h-[420px] w-full object-cover sm:h-[520px]"
            />
          </div>
        </div>

    
        <div className="relative z-10 bg-white">
          <p className="eyebrow">{productData.category}</p>
          <h1 className="editorial-serif mt-3 text-4xl font-semibold leading-tight md:text-5xl">{productData.name}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-bold">
              {currency}
              {productData.price}
            </p>
            {hasSalePrice && (
              <>
                <p className="text-lg font-semibold text-[#8b7b82] line-through">
                  {currency}
                  {productData.compareAtPrice}
                </p>
                <span className="rounded-full bg-[#ef3f45] px-3 py-1 text-xs font-extrabold text-white">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 leading-7 text-[#6f5860]">{productData.description}</p>

          <div className="flex flex-col gap-4 my-8">
            {productVariants.length > 0 && (
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em]">
                  Colour: <span className="normal-case tracking-normal text-[#6f5860]">{selectedVariant?.colorName}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {productVariants.map((variant, index) => (
                    <button
                      key={`${variant.colorName}-${index}`}
                      type="button"
                      onClick={() => selectVariant(variant, index)}
                      className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                        index === selectedVariantIndex ? "border-[#5A0019]" : "border-[#DBCCB7]"
                      }`}
                      aria-label={`Select ${variant.colorName}`}
                    >
                      <span
                        className="h-7 w-7 rounded-full border border-black/10"
                        style={{ backgroundColor: variant.colorValue || "#ffffff" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {requiresSize && (
              <>
                <p className="text-sm font-bold uppercase tracking-[0.16em]">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {productSizes.map((item, index) => (
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
              </>
            )}
            <button
              onClick={() =>
                addToCart(
                  productData._id,
                  size,
                  requiresSize,
                  selectedVariant
                    ? {
                        colorName: selectedVariant.colorName,
                        colorValue: selectedVariant.colorValue,
                        image: selectedVariant.images?.[0] || image,
                      }
                    : null,
                  requiresColor
                )
              }
              className="btn-primary w-full sm:w-auto"
            >
              Add to cart
            </button>
            <hr className="mt-6 border-[#DBCCB7]/60" />
            <div className="grid gap-3 text-sm text-[#6f5860]">
              <p>Curated quality, selected for everyday polish.</p>
              <p>Secure online payment is available at checkout.</p>
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
            Reviews
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
