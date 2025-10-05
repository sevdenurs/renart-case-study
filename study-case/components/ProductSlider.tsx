"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";
import { fetchProducts, type Product, type ProductFilters } from "../app/lib/api";

export default function ProductSlider() {
  const [items, setItems] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        console.log("Applied filters:", filters);
        const data = await fetchProducts(filters);
        setItems(data);
      } catch (err) {
        console.error("The items could not taken:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  return (
    <div className="w-full relative pb-12">
      <ProductFilter onChange={setFilters} />

      {loading ? (
        <div className="text-center py-8 text-sm text-neutral-500">Loading…</div>
      ) : (
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
                price={`$${typeof p.price === "number" ? p.price.toFixed(2) : p.price}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
