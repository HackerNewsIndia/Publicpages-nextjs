// Product.js
import React from "react";
// import { mockProducts } from "./data/MockProducts";
// import "./Product.css";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";

const Product = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/diaryblogspace");
  };

  return (
    <div
      className="mt-6 sm:mb-6 flex flex-row justify-between items-center bg-gray-800 rounded-lg shadow-xl cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md"
      onClick={handleClick}
    >
      <img
        src={product.imageUrl}
        className="w-full h-48 rounded-md"
        alt={product.name}
      />
      <div className="p-5">
        <h2 className="text-lg font-bold text-white mb-2 border-b-2 border-blue-500">
          {product.name}
        </h2>
        <p className="text-base text-white mb-3">{product.description}</p>
        <p className="text-base text-white mb-3">${product.price}</p>
        <a
          href="#"
          className="bg-gray-300 text-gray-800 rounded-lg px-2 py-1 transition-colors duration-200 ease-in-out hover:bg-blue-500"
        >
          <i className="fas fa-cart-plus mr-2"></i> Purchase
        </a>
      </div>
    </div>
  );
};

export default Product;
