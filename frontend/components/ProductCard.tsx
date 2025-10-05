"use client";
import Image from "next/image";
import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

type Props = {
  name: string;
  images: { yellow: string; rose: string; white: string };
  popularityScore: number; 
  price: string; 
};

const COLOR_META = {
  yellow: { hex: "#E6CA97", label: "Yellow Gold" },
  rose:   { hex: "#E1A4A9", label: "Rose Gold" },
  white:  { hex: "#D9D9D9", label: "White Gold" },
} as const;

type ColorKey = keyof typeof COLOR_META;

export default function ProductCard({ name, images, popularityScore, price }: Props) {
  const [selectedColor, setSelectedColor] = useState<ColorKey>("yellow");
  const rating = (popularityScore * 5).toFixed(1);

  return (
    <div className="w-[240px] flex-shrink-0 bg-white rounded-3xl px-4 pt-10 pb-8 text-left flex flex-col items-center justify-between">
      {/* images */}
      <div className="relative w-full h-[220px] flex items-center justify-center bg-[#f7f7f7] rounded-2xl overflow-hidden">
        <Image
          src={images[selectedColor]}
          alt={name}
          width={160}
          height={160}
          className="object-contain"
        />
      </div>

      {/* detail */}
      <div className="mt-4 text-left w-full">
        <h3 className="font-mont text-[15px] font-medium text-black mb-1">{name}</h3>
        <p className="font-mont text-[15px] font-normal text-gray-700 mb-1">{price}</p>

        {/* color selection */}
        <div className="flex gap-2 mt-2 mb-1">
          {(["yellow", "rose", "white"] as ColorKey[]).map((color) => {
            const isActive = selectedColor === color;
            const hex = COLOR_META[color].hex;
            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                aria-label={COLOR_META[color].label}
                className="w-[14px] h-[14px] rounded-full border-[1.5px] transition-all duration-200"
                style={{
                  backgroundColor: hex,
                  borderColor: isActive ? hex : "#D1D5DB",
                  boxShadow: isActive ? `0 0 0 3px ${hex}55` : undefined,
                }}
              />
            );
          })}
        </div>

        {/* selected color */}
        <p className="font-avenir text-[12px] text-gray-500 mb-1">
          {COLOR_META[selectedColor].label}
        </p>

        <div className="flex items-center gap-1 mt-1 text-[14px] font-avenir text-gray-700">
          <span className="text-yellow-500 flex">{renderStars(parseFloat(rating))}</span>
          <span>{rating}/5</span>
        </div>
      </div>
    </div>
  );
}

function renderStars(score: number) {
  const stars = [];
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.25 && score % 1 < 0.75;
  const total = hasHalfStar ? fullStars + 1 : fullStars;
  const emptyStars = 5 - total;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-yellow-500 text-[14px]" />);
  }
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-500 text-[14px]" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500 text-[14px]" />);
  }
  return stars;
}
