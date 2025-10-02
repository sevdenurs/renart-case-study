"use client";
import { useEffect, useRef, useState } from "react";
import { fetchProducts, Product } from "../app/lib/api";
import ProductCard from "./ProductCard";

export default function ProductSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setItems)
      .catch((e) => console.error("Ürünler alınamadı:", e));
  }, []);

  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow"
        aria-label="Scroll Left"
      >
        ←
      </button>

      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x px-8 py-4"
      >
        {items.map((p, i) => (
          <ProductCard
            key={i}
            name={p.name}
            images={p.images}
            popularityScore={p.popularityScore}
            price={"$101.00 USD"}
          />
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow"
        aria-label="Scroll Right"
      >
        →
      </button>
    </div>
  );
}
