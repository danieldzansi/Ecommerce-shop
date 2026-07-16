import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    console.log("All products:", products);
    const sellers = products.filter((item) => {
      return item?.bestseller === true || item?.bestseller === "true";
    });

    setBestSeller(sellers.slice(0, 5));
  }, [products]);

  return (
    <section className="page-x section-y bg-white">
      <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <Title text1={"Most loved"} text2={"The pieces people come back for"} />
        </div>
        <p className="max-w-xl text-sm leading-6 text-[#6f5860]">
          Customer favorites with the kind of finish that makes simple outfits feel considered.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
