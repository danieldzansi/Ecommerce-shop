/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₵";
  const delivery_fee = 10;
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getProductData = useCallback(async () => {
    try {
      const response = await axios.get(`${backend_url}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.allproducts);
        toast.success("Products loaded successfully!", {
          position: "top-right",
        });
      } else {
        toast.error("Failed to load products", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Error fetching product data!", { position: "top-right" });
    }
  }, [backend_url]);

  useEffect(() => {
    getProductData();
  }, [getProductData]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
    backend_url,
    getProductData, 
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
