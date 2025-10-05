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

export default function ProductCard({ name, images, popularityScore, price }: Props) {
  const [selectedColor, setSelectedColor] = useState<keyof typeof images>("yellow");
  const rating = (popularityScore * 5).toFixed(1);

  return (
    <div className="w-[240px] flex-shrink-0 bg-white rounded-3xl px-4 pt-10 pb-8 text-left flex flex-col items-center justify-between">
      
      <div className="relative w-full h-[220px] flex items-center justify-center bg-[#f7f7f7] rounded-2xl overflow-hidden">
        <Image
          src={images[selectedColor]}
          alt={name}
          width={160}
          height={160}
          className="object-contain"
        />
      </div>

      {/* icerik */}
      <div className="mt-4 text-left w-full">
        <h3 className="text-[15px] font-medium text-black mb-1">{name}</h3>
        <p className="text-[14px] text-gray-700 mb-1">{price}</p>

        <div className="flex gap-2 mt-2 mb-1">
          {(["yellow", "rose", "white"] as const).map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-[14px] h-[14px] rounded-full border-[1.5px] transition-all duration-200 ${
                selectedColor === color
                  ? "border-[#E6CA97] ring-2 ring-[#E6CA97]"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: getColorCode(color) }}
            />
          ))}
        </div>

        <p className="text-[12px] text-gray-500 mb-1">Yellow Gold</p>

        <div className="flex items-center gap-1 mt-1 text-[13px] font-montserrat text-gray-700">
          <span className="text-yellow-500 flex">{renderStars(parseFloat(rating))}</span>
          <span>{rating}/5</span>
        </div>
      </div>
    </div>
  );
}

function getColorCode(color: string) {
  return {
    yellow: "#E6CA97",
    rose: "#E1A4A9",
    white: "#D9D9D9",
  }[color];
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
