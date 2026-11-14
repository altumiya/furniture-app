import ProductsList from '@/app/components/product-component/ProductsList'
import Link from 'next/link'
import React from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { getProducts } from '../api-services/home.api'
import { ToastContainer, toast } from 'react-toastify';

export default async function Product({ searchParams }) {

  let data = await getProducts();//server side render
  const products = Array.isArray(data?.data) ? data.data : [];
  const filters = await searchParams;
  const category = filters?.category;
  const subcategory = filters?.subcategory;
  const subsubcategory = filters?.subsubcategory;
  const filteredProducts = products.filter((product) => {
    if (subsubcategory) return product.subsubCategory?.slug === subsubcategory;
    if (subcategory) return product.subCategory?.slug === subcategory;
    if (category) return product.parent?.slug === category;
    return true;
  });

  return (
    <>
        <section className=''>
            <div className='grid grid-cols-1 place-items-center border-b-1 border-gray-200 px-4 py-6 max-w-[1120px] mx-auto' >
                <h2 className='font-playfair font-semibold text-4xl'>Online Store</h2>
                <nav className="flex" aria-label="Breadcrumb">
                <ol className="p-3 px-6 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className='font-rubik text-dark-gray text-sm'>
                        <Link href={"/"}>
                        Home
                        </Link>
                    </li>
                    <li className='font-rubik text-orange-dim text-sm'>
                        <div className="flex items-center">
                        <MdOutlineKeyboardArrowRight className='mr-2' /> Online Store
                        </div>
                    </li> 
                </ol>                   
                </nav>
            </div>
        </section>

        {/* grid-cols-[25%_auto] */}
        <section>
            <div className='grid grid-cols-1 max-w-[1140px] mx-auto'>
                {/* <aside>
                    1
                </aside> */}
                <div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4 mt-5 mb-5">
                        <ProductsList data={filteredProducts} path={data?.path || ""} />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
        
    </>
  )
}
