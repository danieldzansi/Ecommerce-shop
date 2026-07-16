import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";
import { FiImage, FiPlusCircle } from "react-icons/fi";

const Add = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([false, false, false, false]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!images[0]) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true); 

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
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
        setCategory("Men");
        setSubCategory("Topwear");
        setBestseller(false);
        setSizes([]);
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
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-[#5A0019]/50"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
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
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`px-3 py-1 cursor-pointer rounded border  ${
                  sizes.includes(size)
                    ? "border-[#DBCCB7] bg-[#5A0019] text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                } `}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
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
