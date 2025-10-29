import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProduct from '../components/RelatedProduct';
import { useCartStore } from '../store/CartStore'; 

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext); 
  const addToCart = useCartStore((state) => state.addToCart); 
  const [size, setSize] = useState('');
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === productId);
    if (selectedProduct) {
      setProductData(selectedProduct);
      setImage(selectedProduct.image[0]);
    }
  }, [productId, products]);

  if (!productData) return <div className="opacity-0"></div>;

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-100">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Left: Thumbnails + Main Image */}
        <div className="flex gap-4 flex-1">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:h-[500px]">
            {productData.image.map((img, index) => (
              <img key={index} src={img} onClick={() => setImage(img)} alt="" className="w-20 sm:w-24 cursor-pointer border hover:border-black" />
            ))}
          </div>

          <img src={image} alt="" className="flex-1 max-h-[500px] object-contain" />
        </div>

        {/* Right: Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{productData.name}</h2>

          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-4" />
            <img src={assets.star_icon} className="w-4" />
            <img src={assets.star_icon} className="w-4" />
            <img src={assets.star_icon} className="w-4" />
            <img src={assets.star_dull_icon} className="w-4" />
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          <p className="mt-4 text-gray-600">{productData.description}</p>

      
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? 'border-orange-500' : ''
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={() => addToCart(productData._id, size)} 
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>
            <hr className="mt-6 sm:w-4/5" />
            <div className="text-sm text-gray-500 flex flex-col gap-1">
              <p>100% Original product</p>
              <p>Cash on delivery is available on this product</p>
              <p>Easy return and exchange policy within 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description / Reviews Section */}
      <div className="mt-16">
        <div className="flex gap-6 border-b">
          <button className={`pb-2 ${ activeTab === 'description'  ? 'border-b-2 border-black font-medium'   : 'text-gray-500' }`} onClick={() => setActiveTab('description')} > Description</button>
          <button  className={`pb-2 ${    activeTab === 'reviews'      ? 'border-b-2 border-black font-medium' : 'text-gray-500' }`} onClick={() => setActiveTab('reviews')} >Reviews (122)  </button>
        </div>

        {activeTab === 'description' && (
          <div className="mt-5 text-gray-600 leading-6">
            <p>
              An e-commerce website is an online platform that facilitates the
              buying and selling of products or services over the Internet.
            </p>
            <p className="mt-3">
              E-commerce websites typically display products along with detailed
              descriptions, images, prices, and available variations such as
              size or color.
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="mt-5 text-gray-600">
            <p>No reviews yet. Be the first to review this product.</p>
          </div>
        )}
      </div>

      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
