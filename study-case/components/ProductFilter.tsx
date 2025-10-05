"use client";
import { useEffect, useRef, useState } from "react";
import type { ProductFilters } from "../app/lib/api";

type Props = {
  onChange: (f: ProductFilters) => void;
};

export default function ProductFilter({ onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [minPriceStr, setMinPriceStr] = useState<string>("");
  const [maxPriceStr, setMaxPriceStr] = useState<string>("");
  const [stars, setStars] = useState<number>(0); 


  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (ref.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const apply = (f: ProductFilters) => {
    onChange(f);
    setOpen(false);
  };

  const applyManual = () => {
    const minPrice = Number(minPriceStr);
    const maxPrice = Number(maxPriceStr);
    const filters: ProductFilters = {};
    if (Number.isFinite(minPrice)) filters.minPrice = minPrice;
    if (Number.isFinite(maxPrice)) filters.maxPrice = maxPrice;
    if (stars > 0) filters.minPopularity = Math.min(1, Math.max(0, stars * 0.2));
    apply(filters);
  };

  return (
    <div className="w-full relative flex justify-end mb-3">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm shadow-sm hover:shadow transition
                   hover:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" fill="currentColor" />
        </svg>
        Filters
        <span
          className={`ml-1 inline-block transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      <div
        ref={ref}
        role="dialog"
        aria-label="Filtre presetleri"
        className={`absolute right-0 top-[110%] z-50 w-[min(92vw,360px)] rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg
                    transition-all duration-150 origin-top-right
                    ${open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"}`}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-neutral-600 mb-1">Min Price</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={minPriceStr}
                onChange={(e) => setMinPriceStr(e.target.value)}
                placeholder="Eg. 300"
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-neutral-600 mb-1">Max Price</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={maxPriceStr}
                onChange={(e) => setMaxPriceStr(e.target.value)}
                placeholder="Eg. 800"
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-neutral-600 mb-1">Popularity(min)</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={stars === s}
                  onClick={() => setStars(s)}
                  className={`text-lg leading-none ${s <= stars ? "text-yellow-500" : "text-neutral-300"}`}
                  title={`${s} star${s > 1 ? "s" : ""}`}
                >
                  {s <= stars ? "★" : "☆"}
                </button>
              ))}
              {stars > 0 && (
                <button
                  type="button"
                  onClick={() => setStars(0)}
                  className="ml-2 text-xs text-neutral-500 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setMinPriceStr("");
                setMaxPriceStr("");
                setStars(0);
              }}
              className="text-xs underline text-neutral-600 hover:text-black"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={applyManual}
              className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-1.5 text-sm hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
