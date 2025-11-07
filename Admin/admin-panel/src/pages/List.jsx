import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, Currency } from "../config";
import ConfirmDialog from "../components/ConfirmDialog";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [confirmId, setConfirmId] = useState(null);

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

  return (
    <>
      <p className="mb-2 font-semibold text-lg">All Products List</p>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-semibold">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {Array.isArray(list) && list.length > 0 ? (
          list.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border-b text-sm"
            >
              <img
                src={item.image?.[0]}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <p className="truncate">{item.name}</p>
              <p>{item.category}</p>
              <p>
                {Currency}
                {item.price}
              </p>

              <div className="flex justify-center">
                <button
                  onClick={() => setConfirmId(item.id)} // open confirmation
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No products found.</p>
        )}
      </div>

      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to remove this product?"
          onConfirm={handleRemoveConfirmed}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  );
};

export default List;
