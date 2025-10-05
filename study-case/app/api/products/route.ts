import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Product = {
  name: string;
  popularityScore: number;
  weight: number;
  images: { yellow: string; rose: string; white: string };
};

type EnrichedProduct = Product & { price: number };

type GoldApiResponse = {
  price: number;
  timestamp: number;
  metal: string;
  currency: string;
};

async function getGoldPricePerGram(): Promise<number> {
  const res = await fetch("https://api.gold-api.com/price/XAU", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Gold API failed: ${res.status}`);
  const data: GoldApiResponse = await res.json();
  const pricePerOunce = Number(data.price);
  if (!Number.isFinite(pricePerOunce)) throw new Error("Invalid gold price payload");
  return pricePerOunce / 31.1035;
}

function toNum(v: string | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;

    const minPrice = toNum(sp.get("minPrice")) ?? toNum(sp.get("priceMin"));
    const maxPrice = toNum(sp.get("maxPrice")) ?? toNum(sp.get("priceMax"));
    const minPopularity = toNum(sp.get("minPopularity")) ?? toNum(sp.get("popMin"));
    const maxPopularity = toNum(sp.get("maxPopularity")) ?? toNum(sp.get("popMax"));
   
    const dataPath = path.join(process.cwd(), "public", "products.json");
    const json = await fs.readFile(dataPath, "utf8");
    const products: Product[] = JSON.parse(json) as Product[];
    
    const goldPrice = await getGoldPricePerGram();

    const productsWithPrice: EnrichedProduct[] = products.map((p) => {
      const price = (p.popularityScore + 1) * p.weight * goldPrice;
      return { ...p, price: Number(price.toFixed(2)) };
    });

    console.log("Gold price per gram:", goldPrice);
    console.log("Products with prices:", productsWithPrice.map(p => ({
      name: p.name,
      price: p.price,
      popularity: p.popularityScore
    })));
    console.log("Filters:", { minPrice, maxPrice, minPopularity, maxPopularity });

    let filtered: EnrichedProduct[] = productsWithPrice;
    if (minPrice !== undefined) filtered = filtered.filter((p) => p.price >= minPrice);
    if (maxPrice !== undefined) filtered = filtered.filter((p) => p.price <= maxPrice);
    if (minPopularity !== undefined) filtered = filtered.filter((p) => p.popularityScore >= minPopularity);
    if (maxPopularity !== undefined) filtered = filtered.filter((p) => p.popularityScore <= maxPopularity);

    console.log("Filtered count:", filtered.length);

    return NextResponse.json(filtered, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("/api/products error:", message);
    return NextResponse.json(
      { error: "The products couldn't be taken." },
      { status: 500 }
    );
  }
}