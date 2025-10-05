"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

import ProductCard from "./ProductCard";
import { fetchProducts, Product } from "../app/lib/api";

export default function ProductSlider() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts();
        setItems(data);
      } catch (err) {
        console.error("Ürünler alınamadı:", err);
      }
    })();
  }, []);

  return (
    <div className="w-full relative pb-12">
      <h2 className="text-2xl font-semibold text-center mb-6">Product List</h2>

      <Swiper
        modules={[Navigation, Scrollbar]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        scrollbar={{ draggable: true }}
        breakpoints={{
          640:  { slidesPerView: 1, spaceBetween: 20 },
          768:  { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="pb-10 swiper-with-scrollbar custom-swiper"
      >
        {items.map((p, i) => (
          <SwiperSlide key={i} className="flex justify-center">
            <ProductCard
              name={p.name}
              images={p.images}
              popularityScore={p.popularityScore}
              price={`$${p.price}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}