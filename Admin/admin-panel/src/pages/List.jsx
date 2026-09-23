import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiEye, FiTag, FiTrash2, FiXCircle } from "react-icons/fi";
import { backendUrl, Currency } from "../config";
import ConfirmDialog from "../components/ConfirmDialog";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [saleBusyId, setSaleBusyId] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setList(response.data.allproducts || []);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleRemoveConfirmed = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id: confirmId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Product removed successfully");
        fetchList();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

    setConfirmId(null); // close modal
  };

  const isOnSale = (item) => {
    const price = Number(item.price || 0);
    const compareAtPrice = Number(item.compareAtPrice || 0);

    return (item.onSale || compareAtPrice > price) && compareAtPrice > price;
  };

  const updateProductSale = async (item, nextFields) => {
    setSaleBusyId(item.id);

    try {
      const response = await axios.put(
        `${backendUrl}/api/product/update/${item.id}`,
        {
          name: item.name,
          description: item.description,
          category: item.category,
          subCategory: item.subCategory,
          price: nextFields.price,
          compareAtPrice: nextFields.compareAtPrice,
          onSale: nextFields.onSale,
          bestseller: item.bestseller,
          sizes: Array.isArray(item.sizes) ? item.sizes : [],
          variants: Array.isArray(item.variants) ? item.variants : [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to update sale status");
      }

      toast.success(nextFields.onSale ? "Product added to sale" : "Product removed from sale");
      fetchList();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaleBusyId(null);
    }
  };

  const handleAddToSale = (item) => {
    const currentPrice = Number(item.price || 0);
    const originalPrice = Number(item.compareAtPrice || 0) > currentPrice
      ? Number(item.compareAtPrice)
      : currentPrice;
    const enteredPrice = window.prompt(
      `Enter sale price for "${item.name}". It must be lower than ${Currency}${originalPrice}.`,
      String(currentPrice)
    );

    if (enteredPrice === null) return;

    const salePrice = Number(enteredPrice);

    if (!Number.isFinite(salePrice) || salePrice <= 0 || salePrice >= originalPrice) {
      toast.error(`Sale price must be lower than ${Currency}${originalPrice}`);
      return;
    }

    updateProductSale(item, {
      price: salePrice,
      compareAtPrice: originalPrice,
      onSale: true,
    });
  };

  const handleRemoveFromSale = (item) => {
    const restoredPrice = Number(item.compareAtPrice || item.price || 0);

    updateProductSale(item, {
      price: restoredPrice,
      compareAtPrice: "",
      onSale: false,
    });
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
          Catalog
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">View products</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage the products currently available in the storefront.
        </p>
      </div>

      <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="hidden grid-cols-[1fr_3fr_1fr_1fr_1.4fr] items-center border-b border-slate-100 px-3 py-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-400 md:grid">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {Array.isArray(list) && list.length > 0 ? (
          list.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[72px_1fr] gap-3 border-b border-slate-100 px-3 py-4 text-sm text-slate-700 md:grid-cols-[1fr_3fr_1fr_1fr_1.4fr] md:items-center"
            >
              <img
                src={item.image?.[0]}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <p className="truncate">{item.name}</p>
              <p className="text-slate-500">{item.category}</p>
              <p className="font-bold text-slate-950">
                {Currency}
                {item.price}
                {isOnSale(item) && (
                  <span className="mt-1 block text-xs font-semibold text-rose-600">
                    Sale from {Currency}{item.compareAtPrice}
                  </span>
                )}
              </p>

              <div className="flex flex-wrap justify-start gap-2 md:justify-center">
                <Link
                  to={`/products/${item.id}`}
                  className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:border-[#5A0019]/30 hover:text-[#5A0019]"
                >
                  <FiEye />
                  View
                </Link>
                {isOnSale(item) ? (
                  <button
                    onClick={() => handleRemoveFromSale(item)}
                    disabled={saleBusyId === item.id}
                    className="inline-flex items-center gap-2 rounded-[8px] border border-amber-200 px-3 py-2 font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                  >
                    <FiXCircle />
                    Remove sale
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToSale(item)}
                    disabled={saleBusyId === item.id}
                    className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200 px-3 py-2 font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                  >
                    <FiTag />
                    Add to sale
                  </button>
                )}
                <button
                  onClick={() => setConfirmId(item.id)} // open confirmation
                  className="inline-flex items-center gap-2 rounded-[8px] border border-rose-200 px-3 py-2 font-semibold text-rose-700 hover:bg-rose-50"
                >
                  <FiTrash2 />
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-slate-500">No products found.</p>
        )}
      </div>

      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to remove this product?"
          onConfirm={handleRemoveConfirmed}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </section>
  );
};

export default List;
