"use client"
import React from 'react'
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/bundle';
import { FaStar } from "react-icons/fa";

export default function CustomerFeedback({ data }) {
    // Base path for images. (Adjust if your backend runs on a different port/URL)
    const imageBasePath = 'http://localhost:8000/uploads/testimonial/';

    // Fallback if data hasn't loaded or is empty
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500 py-10">Loading testimonials...</p>;
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-playfair font-bold mb-2">
                    What Our Customers Say ?
                </h2>
            </div>
            
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 2000 }}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={item._id || index}>
                        <div>
                            <p className='text-dark-gray font-rubik px-2 text-base/7'>
                                {item.message}
                            </p>
                        </div>
                        <div className='flex place-content-center'>
                            {/* Added justify-items-center to ensure the image centers nicely */}
                            <div className='grid grid-cols-1 gap-3 justify-items-center mt-6'>
                                <img 
                                    className="w-24 h-24 mb-2 rounded-full object-cover" 
                                    src={item.image ? `${imageBasePath}${item.image}` : "/testimonial1.png"} 
                                    alt={item.name} 
                                />
                                <h5 className="text-base font-semibold tracking-tight font-playfair uppercase">
                                    {item.name}
                                </h5>
                                <span className="text-sm font-rubik text-dark-gray">
                                    {item.designation}
                                </span>
                                
                                {/* Dynamic Star Rating */}
                                <div className='text-sm flex justify-center gap-1 mb-4'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar 
                                            key={star} 
                                            className={star <= (item.rating || 5) ? 'text-orange-dim' : 'text-gray-300'} 
                                        />
                                    ))}
                                </div>
                                <div className='p-4'> </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}