import ProductSlider from "@/components/ProductSlider";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Product List</h2>
        <ProductSlider />
      </section>
    </main>
  );
}
