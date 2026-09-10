import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiEdit3, FiImage, FiSave, FiTag, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { backendUrl, Currency } from "../config";

const money = (value) =>
  `${Currency}${Number(value || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const isOnSale = (product) => {
  const price = Number(product?.price || 0);
  const compareAtPrice = Number(product?.compareAtPrice || 0);

  return (product?.onSale || compareAtPrice > price) && compareAtPrice > price;
};

const productCategoryGroups = [
  {
    name: "Men",
    subCategories: ["Bags", "Watches", "Shoes", "Accessories"],
  },
  {
    name: "Women",
    subCategories: ["Bags", "Crossbody Bags", "Tote Bags", "Top Handle Bags", "Clutches", "Shoes", "Watches", "Accessories"],
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

const ProductDetails = ({ token }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

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
        setDraft(response.data.product);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleCategoryChange = (value) => {
    const nextCategory = productCategoryGroups.find((item) => item.name === value) || productCategoryGroups[0];
    setDraft((current) => ({
      ...current,
      category: nextCategory.name,
      subCategory: nextCategory.subCategories[0],
    }));
  };

  const saveProduct = async () => {
    try {
      setSaving(true);
      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        {
          name: draft.name,
          description: draft.description,
          category: draft.category,
          subCategory: draft.subCategory,
          price: draft.price,
          compareAtPrice: draft.compareAtPrice,
          onSale: draft.onSale,
          bestseller: draft.bestseller,
          sizes: Array.isArray(draft.sizes) ? draft.sizes : [],
          variants: Array.isArray(draft.variants) ? draft.variants : [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to update product");
      }

      setProduct(response.data.product);
      setDraft(response.data.product);
      setEditing(false);
      toast.success("Product updated");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Unable to update product");
    } finally {
      setSaving(false);
    }
  };

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

  const activeProduct = editing && draft ? draft : product;
  const productIsOnSale = isOnSale(activeProduct);
  const selectedCategory = productCategoryGroups.find((item) => item.name === draft?.category) || productCategoryGroups[0];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/list"
          className="inline-flex w-fit items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:text-[#5A0019]"
        >
          <FiArrowLeft />
          Back to products
        </Link>
        <button
          type="button"
          onClick={() => {
            setDraft(product);
            setEditing((value) => !value);
          }}
          className="inline-flex items-center gap-2 rounded-[8px] bg-[#5A0019] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#720022]"
        >
          {editing ? <FiX /> : <FiEdit3 />}
          {editing ? "Cancel edit" : "Edit product"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-[8px] bg-white ring-1 ring-slate-100">
            <img
              src={activeProduct.image?.[0]}
              alt={activeProduct.name}
              className="aspect-square w-full rounded-[8px] object-contain"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {(activeProduct.image || []).map((image) => (
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
          {editing ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
                Edit Product
              </p>
              <div className="mt-5 grid gap-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Product name</p>
                  <input
                    value={draft.name || ""}
                    onChange={(e) => updateDraft("name", e.target.value)}
                    className="w-full rounded-[8px] border border-slate-200 px-4 py-3 outline-none focus:border-[#5A0019]/50"
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Description</p>
                  <textarea
                    value={draft.description || ""}
                    onChange={(e) => updateDraft("description", e.target.value)}
                    className="min-h-28 w-full rounded-[8px] border border-slate-200 px-4 py-3 outline-none focus:border-[#5A0019]/50"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">Category</p>
                    <select
                      value={draft.category || ""}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full rounded-[8px] border border-slate-200 px-4 py-3 outline-none focus:border-[#5A0019]/50"
                    >
                      {productCategoryGroups.map((item) => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">Sub category</p>
                    <select
                      value={draft.subCategory || ""}
                      onChange={(e) => updateDraft("subCategory", e.target.value)}
                      className="w-full rounded-[8px] border border-slate-200 px-4 py-3 outline-none focus:border-[#5A0019]/50"
                    >
                      {selectedCategory.subCategories.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">Current price</p>
                    <input
                      value={draft.price || ""}
                      onChange={(e) => updateDraft("price", e.target.value)}
                      type="number"
                      min="0"
                      className="w-full rounded-[8px] border border-slate-200 px-4 py-3 outline-none focus:border-[#5A0019]/50"
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">Original price</p>
                    <input
                      value={draft.compareAtPrice || ""}
                      onChange={(e) => updateDraft("compareAtPrice", e.target.value)}
                      type="number"
                      min="0"
                      className="w-full rounded-[8px] border border-slate-200 px-4 py-3 outline-none focus:border-[#5A0019]/50"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.onSale)}
                      onChange={(e) => updateDraft("onSale", e.target.checked)}
                    />
                    On sale
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.bestseller)}
                      onChange={(e) => updateDraft("bestseller", e.target.checked)}
                    />
                    Bestseller
                  </label>
                </div>
                <button
                  type="button"
                  onClick={saveProduct}
                  disabled={saving}
                  className="inline-flex w-fit items-center gap-2 rounded-[8px] bg-[#5A0019] px-5 py-3 text-sm font-bold text-white hover:bg-[#720022] disabled:opacity-60"
                >
                  <FiSave />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
                Product Details
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950">{activeProduct.name}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{activeProduct.description}</p>
            </>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <FiTag className="text-[#5A0019]" />
                Price
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-950">{money(activeProduct.price)}</p>
              {productIsOnSale && (
                <p className="mt-1 text-sm font-semibold text-rose-600">
                  Sale from <span className="line-through">{money(activeProduct.compareAtPrice)}</span>
                </p>
              )}
            </div>
            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <FiImage className="text-[#5A0019]" />
                Images
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {(activeProduct.image || []).length}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Category</span>
              <span className="font-bold text-slate-950">{activeProduct.category}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Sub category</span>
              <span className="font-bold text-slate-950">{activeProduct.subCategory}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-slate-500">Sizes</span>
              <span className="font-bold text-slate-950">
                {(activeProduct.sizes || []).join(", ") || "None"}
              </span>
            </div>
            <div className="border-b border-slate-100 pb-3">
              <div className="mb-2 flex justify-between">
                <span className="text-slate-500">Colours</span>
                <span className="font-bold text-slate-950">
                  {(activeProduct.variants || []).length || "None"}
                </span>
              </div>
              {(activeProduct.variants || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeProduct.variants.map((variant, index) => (
                    <span
                      key={`${variant.colorName}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700"
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: variant.colorValue || "#ffffff" }}
                      />
                      {variant.colorName || "Colour"}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bestseller</span>
              <span className="inline-flex items-center gap-2 font-bold text-slate-950">
                {activeProduct.bestseller ? (
                  <>
                    <FiCheckCircle className="text-emerald-600" />
                    Yes
                  </>
                ) : (
                  "No"
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">On sale</span>
              <span className="inline-flex items-center gap-2 font-bold text-slate-950">
                {productIsOnSale ? (
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
