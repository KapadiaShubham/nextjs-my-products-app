// 6. app/all-products/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { CldImage } from "next-cloudinary";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const [copiedId, setCopiedId] = useState(null);

  const [loadingId, setLoadingId] = useState(null); // holds the ID of the product being updated

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.sku.includes(search) ||
      p.color.includes(search) ||
      String(p.price).includes(search)
  );

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-xl font-bold mb-4'>All Products</h1>
      <input
        className='w-full border p-2 mb-4'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Search products...'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {filtered.map((p) => (
          <div key={p._id} className='border rounded shadow p-4 flex gap-4'>
            {/* Left side: Info and Buttons */}
            <div className='flex-1 flex flex-col justify-between'>
              <div>
                <p>
                  <strong>SKU:</strong> {p.sku}
                </p>
                <p>
                  <strong>Price:</strong> {p.price}
                </p>
                <p>
                  <strong>Color:</strong> {p.color}
                </p>
              </div>

              <div className='mt-4 flex flex-col items-start gap-2'>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(p._id);
                    setCopiedId(p._id);
                    setTimeout(() => setCopiedId(null), 1500);
                  }}
                  className={`px-3 py-1 text-sm rounded border font-bold transition-all duration-200 cursor-pointer ${
                    copiedId === p._id
                      ? 'bg-green-100 border-green-400 text-green-700'
                      : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {copiedId === p._id ? 'Copied!' : 'Copy ID'}
                </button>

                <button
                  disabled={loadingId === p._id}
                  className={`px-3 py-1 rounded text-white transition-colors ${
                    loadingId === p._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : p.deleteRequest
                      ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
                      : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                  }`}
                  onClick={async () => {
                    setLoadingId(p._id);

                    const res = await fetch('/api/products/patch', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: p._id,
                        deleteRequest: !p.deleteRequest,
                      }),
                    });

                    if (res.ok) {
                      const updatedProduct = await res.json();
                      setProducts((prev) =>
                        prev.map((p) =>
                          p._id === updatedProduct._id ? updatedProduct : p
                        )
                      );
                    }

                    setLoadingId(null);
                  }}
                >
                  {loadingId === p._id ? (
                    <>
                      <span className='animate-spin mr-2'>⏳</span>Processing...
                    </>
                  ) : p.deleteRequest ? (
                    'Cancel Delete'
                  ) : (
                    'Request Delete'
                  )}
                </button>
              </div>
            </div>

            {/* Right side: Image */}
            {p.imageUrl && (
              <div className='w-40 flex flex-col items-center'>
                {/* <img
                  src={p.imageUrl}
                  alt='Product'
                  className='w-full h-48 object-cover rounded'
                /> */}
                <CldImage
                  src={p.imageUrl}
                  alt={`${p.sku} - ${p.color}`}
                  width={50}
                  height={100}
                  className='w-full h-full object-cover'
                />
                {/* <a
                  href={p.imageUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 text-sm mt-2 underline cursor-pointer'
                >
                  View Image
                </a> */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
