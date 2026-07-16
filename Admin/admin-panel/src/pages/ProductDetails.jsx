import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiImage, FiTag } from "react-icons/fi";
import { backendUrl, Currency } from "../config";

const money = (value) =>
  `${Currency}${Number(value || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${backendUrl}/api/product/single/${id}`);
        if (!response.data?.success) {
          throw new Error(response.data?.message || "Product not found");
        }
        setProduct(response.data.product);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="grid min-h-[55vh] place-items-center text-slate-500">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[8px] border border-rose-200 bg-rose-50 p-5 text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Link
        to="/list"
        className="inline-flex w-fit items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:text-[#5A0019]"
      >
        <FiArrowLeft />
        Back to products
      </Link>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
          <img
            src={product.image?.[0]}
            alt={product.name}
            className="aspect-square w-full rounded-[8px] object-cover"
          />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {(product.image || []).map((image) => (
              <img
                key={image}
                src={image}
                alt=""
                className="aspect-square rounded-[8px] object-cover ring-1 ring-slate-200"
              />
            ))}
          </div>
        </div>

        <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            Product Details
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{product.name}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <FiTag className="text-[#5A0019]" />
                Price
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-950">{money(product.price)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <FiImage className="text-[#5A0019]" />
                Images
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {(product.image || []).length}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Category</span>
              <span className="font-bold text-slate-950">{product.category}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Sub category</span>
              <span className="font-bold text-slate-950">{product.subCategory}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Sizes</span>
              <span className="font-bold text-slate-950">
                {(product.sizes || []).join(", ") || "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bestseller</span>
              <span className="inline-flex items-center gap-2 font-bold text-slate-950">
                {product.bestseller ? (
                  <>
                    <FiCheckCircle className="text-emerald-600" />
                    Yes
                  </>
                ) : (
                  "No"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
