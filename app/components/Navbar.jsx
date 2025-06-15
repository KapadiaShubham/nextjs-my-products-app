'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `px-4 py-2 rounded-md font-medium transition ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-blue-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="bg-white shadow p-4 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <Link href="/" className="text-xl font-bold text-blue-700">
          Dhunki Product App
        </Link>
        <div className="flex gap-4">
          <Link href="/add-product" className={linkClass("/add-product")}>
            Add Product
          </Link>
          <Link href="/all-products" className={linkClass("/all-products")}>
            All Products
          </Link>
        </div>
      </div>
    </nav>
  );
}
