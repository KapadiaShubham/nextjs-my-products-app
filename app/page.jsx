// app/page.jsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4 px-10">
      <h1 className="text-3xl font-bold text-center mb-5">Welcome to Dhunki's Product App</h1>
      <Link href="/add-product" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Add a Product
      </Link>
      <Link href="/all-products" className="bg-green-500 text-white px-4 py-2 rounded-lg">
        View All Products
      </Link>
    </div>
  );
}