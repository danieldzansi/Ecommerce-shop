import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
   
      setLatestProducts(products.slice(0, 10));
    
  }, [products]);

  return (
    <section className='page-x section-y border-b border-[#DBCCB7]/60'>
      <div className='mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end'>
        <div>
          <Title text1={'New in'} text2={'Fresh arrivals'} />
        </div>
        <p className='max-w-xl text-sm leading-6 text-[#6f5860]'>
          Pieces chosen for impact without the effort: polished accessories, statement staples, and everyday luxury.
        </p>
      </div>

      <div className='grid grid-cols-2 gap-5 gap-y-10 md:grid-cols-3 lg:grid-cols-5'>
        {latestProducts.map((item, index) => (
          <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;
