"use client"
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, Scrollbar, A11y } from 'swiper/modules';
import axios from 'axios';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Slider() {
    const [sliders, setSliders] = useState([]);
    const [imagePath, setImagePath] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                // Adjust the URL to match your backend base URL if it's deployed
                const res = await axios.get('http://localhost:8000/api/web/home/slider');
                
                if (res.data.status) {
                    setSliders(res.data.data);
                    setImagePath(res.data.path);
                }
            } catch (error) {
                console.error("Error fetching sliders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    // Optional loading state placeholder
    if (loading) {
        return <div className="flex h-64 items-center justify-center">Loading...</div>;
    }

    // Don't render the swiper if there are no active sliders in the database
    if (sliders.length === 0) {
        return null;
    }

    return (
        <div className='home-banner'>
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
            >
                {sliders.map((slider) => (
                    <SwiperSlide key={slider._id}>
                        <div className="w-full h-[250px] sm:h-[200px] md:h-[300px] lg:h-[400px]">
                        <img 
                            src={`${imagePath}${slider.image}`} 
                            alt={slider.name || "Slider Image"} 
                            className="w-full h-full object-cover block"
                        />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}