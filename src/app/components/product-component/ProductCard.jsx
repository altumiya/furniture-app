import Link from 'next/link';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteCart,fetchCartbyId } from '@/redux/cartSlice';
import { fetchWishlist } from '@/redux/wishlistSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import axios from "axios";
import 'izitoast/dist/css/iziToast.min.css';
let iziToast;
if (typeof window !== 'undefined') {
  iziToast = require('izitoast');
}


export default function ProductCard({ productData = {}, path= "" }) {

  let { name, _id, image, salePrice, price, parent, quantity, stock, slug, id } = productData;
  let dispatch = useDispatch();
  let cart = useSelector((myStore) => myStore.cartStore.cart || [])
  let token = useSelector((allStore) => allStore.userStore?.token || null) 
  
  let apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;
  let checkItemInCart = cart.find((obj) => obj.productId == _id)

  let wishlist = useSelector((myStore) => myStore.wishlistStore?.items || []);
  let isWishlisted = wishlist.some((obj) => obj.productId === _id);

  let addtoCartItem = () => {
   
    let cartObj = {
      productName: name,
      productPrice: salePrice,
      productId: _id,
      productImage: path + image,
      qty: 1,
      productCategory: parent.name
    };
    if (token && token !== "null" && token !== "undefined") {
      axios
        .post(`${apiBaseUrl}web/cart/add-to-cart`, cartObj, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            dispatch(fetchCartbyId());
            iziToast.success({
              title: "success",
              position:'topRight',
              message: finalRes.message,
            });
          }
        });
    } else {
      console.log("Please Login"); 
      iziToast.error({             
        title: "Error",
        message: "Please login to add items to cart",
      });
    }
  };

  let removeCart = async () => {
    if (checkItemInCart) {
      axios
        .delete(`${apiBaseUrl}web/cart/delete-cart/${checkItemInCart._id}`)
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            dispatch(fetchCartbyId());
            
            iziToast.success({
              title: "Success",
              position: 'topRight',
              message: finalRes.message || "Item removed from cart successfully!",
            });
          } else {
            iziToast.error({
              title: "Error",
              position: 'topRight',
              message: finalRes.message || "Failed to remove item from cart.",
            });
          }
        })
        .catch((error) => {
          console.error("Remove cart error:", error);
          iziToast.error({
            title: "Error",
            position: 'topRight',
            message: "Something went wrong while removing the item.",
          });
        });
    }
  };
  let toggleWishlistItem = () => {
    if (token && token !== "null" && token !== "undefined") {
      let wishlistObj = {
        productName: name,
        productPrice: salePrice,
        productId: _id,
        productImage: path + image,
        productCategory: parent.name
      };

      axios
        .post(`${apiBaseUrl}web/wishlist/toggle`, wishlistObj, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data)
        .then((finalRes) => {
          if (finalRes.status) {
            dispatch(fetchWishlist()); 
            
            if (finalRes.action === "added") {
              iziToast.success({ title: "Success", position: 'topRight', message: "Added to wishlist!" });
            } else {
              iziToast.info({ title: "Removed", position: 'topRight', message: "Removed from wishlist." });
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      iziToast.error({ title: "Error", position: 'topRight', message: "Please login to add to wishlist" });
    }
  };

  return (
    <>
      <div data-scroll-reveal className="w-[100%] inline-flex px-2 pb-4">
        <div className="relative bg-white inline-flex items-stretch w-full h-full p-0 box-border">
          <div className="relative shadow-lg rounded-lg min-w-full flex flex-col">
            <div className="relative">
              <div className={"relative rounded-t-lg w-full bg-white text-ellipsis	overflow-hidden"}>
                <Link href={`/product/${slug || _id}`} className="bg-no-repeat bg-cover inline-block my-0 mx-auto text-center ">
                  <img
                    src={path+image}
                    alt=""
                    className="w-full h-[250px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
            </div>
            <div className="relative p-2 box-border overflow-hidden grow text-center">
              <div className="w-full text-center text-xs leading-6 mx-0 my-1 text-gray-600">
                {parent.name}
              </div>
              <div className="text-gray-800 max-h-[38px] text-sm font-semibold leading-5 overflow-hidden whitespace-normal break-words line-clamp-1 mb-4">
                <Link href={`/product/${slug || _id}`}>
                  {name}
                </Link>
              </div>
              <div className='h-[1px] bg-linear-65 from-transparent via-zinc-200 via-40% to-transparent to-100% text-center my-2'>
              </div>
              <div>
                <div className="flex justify-center items-center w-full text-sm px-2 py-2 mb-2">
                  <span className='line-through text-gray-500 pr-2'>Rs. {price}</span>
                  <span className='font-semibold text-orange-dim text-base'>Rs. {salePrice}</span>
                </div>
              </div>

              <div className="min-h-[14px] text-xs flex justify-center items-stretch gap-2 mb-4">
                
                <button
                  onClick={toggleWishlistItem}
                  className="cursor-pointer flex items-center justify-center bg-gray-100 px-3 transition-colors duration-300 hover:bg-gray-200"
                  aria-label="Toggle Wishlist"
                >
                  {isWishlisted ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <FaRegHeart className="text-gray-500 text-lg hover:text-red-500 transition-colors" />
                  )}
                </button>
                {
                  checkItemInCart ?
                    <button
                      className="cursor-pointer bg-orange-dim text-white px-4 py-2 transition-colors duration-300 hover:bg-red-600 flex-1"
                      key={id}
                      onClick={removeCart}
                    >Remove from Cart</button>
                    :
                    <button
                      className="cursor-pointer bg-gray-300 text-gray-700 px-4 py-2 transition-colors duration-300 hover:bg-orange-dim hover:text-white flex-1"
                      key={id}
                      onClick={addtoCartItem}
                    >Add to Cart</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
