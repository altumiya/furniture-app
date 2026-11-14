"use client"
import React, { useState } from "react";
import ProductCard from "../product-component/ProductCard";

export default function ProductFeaturedTabs({ data = [], path = "" }) {
  const [productTab, setProductTab] = useState("Featured");
  const tabs = ["Featured", "New Arrivals", "On Sale"];
  const visibleProducts = data.filter(
    (product) =>
      product.productType === productTab ||
      (productTab === "On Sale" && product.upSell === true)
  );

  return (
    <>
      <div className="w-full max-w-[1140px] mx-auto px-2 py-5">
        <div className="flex items-center justify-center">
          <div
            className={`flex 
                    relative 
                    border-2 
                    border-gray-200 
                    before:content-empty 
                    before:absolute 
                    before:w-[200px] 
                    before:h-[2px] 
                    before:right-full 
                    before:top-1/2
                    before:-translate-y-1/2
                    before:bg-gradient-to-r
                    before:from-transparent
                    before:to-[#ebebeb]
                    after:content-empty
                    after:absolute
                    after:w-[200px]
                    after:h-[2px]
                    after:left-[100.4%]
                    after:top-1/2
                    after:-translate-y-1/2
                    after:bg-gradient-to-r
                    after:from-[#ebebeb]
                    after:to-transparent
                    `}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setProductTab(tab)}
                className={`font-playfair font-bold text-lg px-5 py-2 ${
                  productTab === tab
                    ? "relative text-orange-dim before:content-empty before:absolute before:top-[-2px] before:left-[-2px] before:w-[104%] before:h-[109%] before:left before:border-2 before:border-orange-dim"
                    : "text-dark-gray border-l-2 border-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4 mt-5">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} productData={product} path={path} />
          ))}
        </div>
        {visibleProducts.length === 0 && (
          <p className="mt-5 text-center font-rubik text-sm text-gray-500">
            No products are available in this collection.
          </p>
        )}
      </div>
    </>
  );
}

