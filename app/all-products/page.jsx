'use client';
import { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    color: '',
    size: '',
    priceRange: '', // Optional
  });

  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);
  const [uniqueSizes, setUniqueSizes] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        const types = [...new Set(data.map((p) => p.type).filter(Boolean))];
        const colors = [...new Set(data.map((p) => p.color).filter(Boolean))];
        const sizes = [
          ...new Set(
            data
              .flatMap((p) => p.sizes?.split(',').map((s) => s.trim()) || [])
              .filter(Boolean)
          ),
        ];

        setUniqueTypes(types);
        setUniqueColors(colors);
        setUniqueSizes(sizes);
      });
  }, []);

  const filtered = products.filter((p) => {
    // SEARCH LOGIC
    const terms = search.toLowerCase().split(' ').filter(Boolean);
    const searchableFields = [
      p._id, // ✅ Now searchable by MongoDB ObjectID
      p.sku,
      p.fabric,
      p.color,
      p.specialty,
      p.priceStr,
      String(p.price),
      p.sizes,
      p.sleeveType,
      p.catalogue,
      p.gst5Percent,
      p.singleAvailable,
      p.type,
    ];

    const matchesSearch = terms.every((term) =>
      searchableFields.some((field) =>
        String(field).toLowerCase().includes(term)
      )
    );

    // FILTER LOGIC
    const matchesType = !filters.type || p.type === filters.type;
    const matchesColor = !filters.color || p.color === filters.color;
    const matchesSize =
      !filters.size ||
      p.sizes?.toLowerCase().includes(filters.size.toLowerCase());

    return matchesSearch && matchesType && matchesColor && matchesSize;
  });

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-xl font-bold mb-4'>All Products</h1>
      <input
        className='w-full border p-2 mb-4'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Search products...'
      />
      <div className='mb-6 flex flex-wrap gap-4'>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className='border px-3 py-1 rounded'
        >
          <option value=''>Filter by Type</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.color}
          onChange={(e) => setFilters({ ...filters, color: e.target.value })}
          className='border px-3 py-1 rounded'
        >
          <option value=''>Filter by Color</option>
          {uniqueColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        <select
          value={filters.size}
          onChange={(e) => setFilters({ ...filters, size: e.target.value })}
          className='border px-3 py-1 rounded'
        >
          <option value=''>Filter by Size</option>
          {uniqueSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              type: '',
              color: '',
              size: '',
              priceRange: '', // optional
            }))
          }
          className='px-3 py-1 bg-red-100 text-red-600 rounded cursor-pointer hover:bg-red-200'
        >
          Clear Filters
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {filtered.map((p) => (
          <ProductCard key={p._id} product={p} setProducts={setProducts} />
        ))}
      </div>
    </div>
  );
}
