import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";
import { FiImage, FiPlus, FiPlusCircle, FiTrash2 } from "react-icons/fi";

const productCategoryGroups = [
  {
    name: "Men",
    subCategories: ["Bags", "Watches", "Shoes", "Accessories"],
  },
  {
    name: "Women",
    subCategories: [
      "Bags",
      "Crossbody Bags",
      "Tote Bags",
      "Top Handle Bags",
      "Clutches",
      "Shoes",
      "Watches",
      "Accessories",
    ],
  },
  {
    name: "Home Aromatics",
    subCategories: ["Candles", "Diffusers", "Room Sprays"],
  },
  {
    name: "Gift Sets",
    subCategories: ["Gift Sets"],
  },
];

const sizePresets = {
  clothing: ["S", "M", "L", "XL", "XXL"],
  numeric: Array.from({ length: 18 }, (_, index) => String(index + 23)),
  oneSize: ["One Size"],
};

const emptyVariant = () => ({
  colorName: "",
  colorValue: "#5A0019",
  sizes: [],
  images: [false, false, false, false],
});

const Add = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([false, false, false, false]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [category, setCategory] = useState(productCategoryGroups[0].name);
  const [subCategory, setSubCategory] = useState(productCategoryGroups[0].subCategories[0]);
  const [bestseller, setBestseller] = useState(false);
  const [sizeMode, setSizeMode] = useState("clothing");
  const [customSize, setCustomSize] = useState("");
  const [sizes, setSizes] = useState([]);
  const [variants, setVariants] = useState([]);
  const selectedCategory = productCategoryGroups.find((item) => item.name === category) || productCategoryGroups[0];
  const subCategoryOptions = selectedCategory.subCategories;

  const handleCategoryChange = (value) => {
    const nextCategory = productCategoryGroups.find((item) => item.name === value) || productCategoryGroups[0];

    setCategory(nextCategory.name);
    setSubCategory(nextCategory.subCategories[0]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const hasMainImage = images.some(Boolean);
    const hasColourImage = variants.some((variant) => variant.images.some(Boolean));

    if (!hasMainImage && !hasColourImage) {
      toast.error("Please upload at least one main image or colour image");
      return;
    }

    if (onSale && (!compareAtPrice || Number(compareAtPrice) <= Number(price))) {
      toast.error("Original price must be higher than the sale price");
      return;
    }

    setLoading(true); 

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("compareAtPrice", compareAtPrice);
      formData.append("onSale", onSale);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append(
        "variants",
        JSON.stringify(
          variants.map((variant) => ({
            colorName: variant.colorName,
            colorValue: variant.colorValue,
            sizes: variant.sizes.length > 0 ? variant.sizes : sizes,
          }))
        )
      );
      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });
      variants.forEach((variant, variantIndex) => {
        variant.images.forEach((image, imageIndex) => {
          if (image) formData.append(`variant_${variantIndex}_image_${imageIndex + 1}`, image);
        });
      });

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
        setImages([false, false, false, false]);
        setName("");
        setDescription("");
        setPrice("");
        setCompareAtPrice("");
        setOnSale(false);
        setCategory(productCategoryGroups[0].name);
        setSubCategory(productCategoryGroups[0].subCategories[0]);
        setBestseller(false);
        setSizeMode("clothing");
        setCustomSize("");
        setSizes([]);
        setVariants([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateImage = (index, file) => {
    setImages((prev) => prev.map((image, imageIndex) => (imageIndex === index ? file : image)));
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  const handleSizeModeChange = (mode) => {
    setSizeMode(mode);
    if (mode === "oneSize") {
      setSizes(sizePresets.oneSize);
    } else if (mode !== "custom") {
      setSizes([]);
    }
  };

  const addCustomSize = () => {
    const nextSize = customSize.trim();
    if (!nextSize) return;
    setSizes((prev) => (prev.includes(nextSize) ? prev : [...prev, nextSize]));
    setCustomSize("");
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, emptyVariant()]);
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const updateVariantImage = (variantIndex, imageIndex, file) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              images: variant.images.map((image, currentImageIndex) =>
                currentImageIndex === imageIndex ? file : image
              ),
            }
          : variant
      )
    );
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, variantIndex) => variantIndex !== index));
  };

  const activePresetSizes = sizeMode === "numeric" ? sizePresets.numeric : sizePresets.clothing;

  return (
    <form
      onSubmit={onSubmitHandler}
      className="mx-auto flex w-full max-w-5xl flex-col gap-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
          Catalog
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Add product</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new storefront item with images, pricing, sizing, and category details.
        </p>
      </div>

      <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <FiImage className="text-[#5A0019]" />
          Product images
        </p>
        <p className="mb-3 text-xs text-slate-500">
          Optional when colour images are added. If empty, the first colour image becomes the product card image.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <label
              key={index}
              htmlFor={`image${index + 1}`}
              className="group cursor-pointer rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-3 transition hover:border-[#5A0019]/40"
            >
              <img
                className="aspect-square w-full rounded-[8px] object-cover"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt=""
              />
              <p className="mt-2 text-center text-xs font-semibold text-slate-500">
                Image {index + 1}
              </p>
              <input
                onChange={(e) => updateImage(index, e.target.files[0])}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="w-full">
        <p className="mb-2 text-sm font-semibold text-slate-700">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2 text-sm font-semibold text-slate-700">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="min-h-32 w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50"
          placeholder="Write here"
          required
        ></textarea>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:gap-8">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Product Category</p>
          <select
            onChange={(e) => handleCategoryChange(e.target.value)}
            value={category}
            className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50"
          >
            {productCategoryGroups.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50"
          >
            {subCategoryOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50 sm:w-[140px]"
            type="number"
            placeholder="34"
            required
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Original Price</p>
          <input
            onChange={(e) => setCompareAtPrice(e.target.value)}
            value={compareAtPrice}
            className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50 sm:w-[150px]"
            type="number"
            placeholder="45"
            min="0"
          />
          <p className="mt-1 text-xs text-slate-500">Use only for sale items.</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Product Sizes</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {[
            ["clothing", "Clothing"],
            ["numeric", "23-40"],
            ["oneSize", "One Size"],
            ["custom", "Custom"],
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleSizeModeChange(mode)}
              className={`rounded-full border px-4 py-2 text-sm font-bold ${
                sizeMode === mode
                  ? "border-[#5A0019] bg-[#5A0019] text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {sizeMode !== "oneSize" && sizeMode !== "custom" && (
          <div className="flex flex-wrap gap-3">
            {activePresetSizes.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={`min-w-11 cursor-pointer rounded border px-3 py-2 text-sm font-bold ${
                  sizes.includes(size)
                    ? "border-[#DBCCB7] bg-[#5A0019] text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {sizeMode === "oneSize" && (
          <div className="inline-flex rounded-full border border-[#DBCCB7] bg-[#5A0019] px-4 py-2 text-sm font-bold text-white">
            One Size
          </div>
        )}

        {sizeMode === "custom" && (
          <div className="flex flex-col gap-3">
            <div className="flex max-w-md gap-2">
              <input
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                className="min-w-0 flex-1 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50"
                type="text"
                placeholder="Enter size, e.g. 42, 7, Mini"
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#5A0019] px-4 py-3 text-sm font-bold text-white"
              >
                <FiPlus />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className="rounded-full border border-[#DBCCB7] bg-[#5A0019] px-3 py-1 text-sm font-bold text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Product Colours</p>
            <p className="mt-1 text-xs text-slate-500">
              Add real colour versions with their own images for storefront swatches.
            </p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-2 rounded-[8px] border border-[#5A0019] bg-white px-4 py-2 text-sm font-bold text-[#5A0019]"
          >
            <FiPlus />
            Add colour
          </button>
        </div>

        {variants.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="rounded-[8px] border border-slate-200 bg-white p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_130px_auto] md:items-end">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Colour name</p>
                    <input
                      value={variant.colorName}
                      onChange={(e) => updateVariant(variantIndex, "colorName", e.target.value)}
                      className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50"
                      type="text"
                      placeholder="Red, White, Gold"
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Swatch</p>
                    <input
                      value={variant.colorValue}
                      onChange={(e) => updateVariant(variantIndex, "colorValue", e.target.value)}
                      className="h-12 w-full cursor-pointer rounded-[8px] border border-slate-200 bg-white p-1"
                      type="color"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(variantIndex)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-rose-200 px-4 text-sm font-bold text-rose-600"
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {variant.images.map((image, imageIndex) => (
                    <label
                      key={imageIndex}
                      htmlFor={`variant-${variantIndex}-image-${imageIndex}`}
                      className="group cursor-pointer rounded-[8px] border border-dashed border-slate-300 bg-slate-50 p-3 transition hover:border-[#5A0019]/40"
                    >
                      <img
                        className="aspect-square w-full rounded-[8px] object-cover"
                        src={!image ? assets.upload_area : URL.createObjectURL(image)}
                        alt=""
                      />
                      <p className="mt-2 text-center text-xs font-semibold text-slate-500">
                        Colour image {imageIndex + 1}
                      </p>
                      <input
                        onChange={(e) => updateVariantImage(variantIndex, imageIndex, e.target.files[0])}
                        type="file"
                        id={`variant-${variantIndex}-image-${imageIndex}`}
                        hidden
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-[8px] border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No colours added. The storefront will use the main product images only.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-5 mt-2">
        <div className="flex gap-2">
          <input
            onChange={() => setBestseller(!bestseller)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
          />
          <label className="cursor-pointer text-sm font-semibold text-slate-700" htmlFor="bestseller">
            Add to Bestseller
          </label>
        </div>
        <div className="flex gap-2">
          <input
            onChange={() => setOnSale(!onSale)}
            checked={onSale}
            type="checkbox"
            id="onSale"
          />
          <label className="cursor-pointer text-sm font-semibold text-slate-700" htmlFor="onSale">
            Add to On Sale
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-4 flex w-48 items-center justify-center gap-2 rounded-[8px] py-3 font-bold text-white ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-[#5A0019] hover:bg-[#720022]"
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Adding...</span>
          </>
        ) : (
          <span className="inline-flex items-center gap-2"><FiPlusCircle /> Add product</span>
        )}
      </button>
      </div>
    </form>
  );
};

export default Add;
