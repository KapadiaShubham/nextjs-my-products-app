// 6. app/all-products/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldImage } from 'next-cloudinary';

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

  const router = useRouter();

  const filtered = products.filter((p) => {
    const terms = search.toLowerCase().split(' ').filter(Boolean);

    const searchableFields = [
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

    return terms.every((term) =>
      searchableFields.some((field) =>
        String(field).toLowerCase().includes(term)
      )
    );
  });

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
          <div key={p._id} className='border rounded shadow p-4 space-y-4'>
            {/* Top Row: Info and Image */}
            <div className='flex gap-4'>
              {/* Left side: Info */}
              <div className='flex-1 space-y-1 text-sm text-gray-800'>
                {[
                  ['SKU', p.sku],
                  ['Price', `₹${p.price} (${p.priceStr})`],
                  ['Color', p.color],
                  ['Fabric', p.fabric],
                  ['Specialty', p.specialty],
                  ['Sizes', p.sizes],
                  ['Sleeve Type', p.sleeveType],
                  ['Catalogue', p.catalogue],
                  ['GST 5%', p.gst5Percent],
                  ['Single Available', p.singleAvailable],
                  ['Type', p.type],
                ].map(([label, value]) => (
                  <p key={label}>
                    <strong>{label}:</strong> {value || '—'}
                  </p>
                ))}
              </div>

              {/* Right side: Image */}
              {p.imageUrl && (
                <div className='w-40 flex flex-col items-center'>
                  <CldImage
                    src={p.imageUrl}
                    alt={`${p.sku} - ${p.color}`}
                    width={100}
                    height={200}
                    className='w-full object-cover'
                  />
                  <a
                    href={p.imageUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 text-sm mt-2 underline cursor-pointer'
                  >
                    View Image
                  </a>
                </div>
              )}
            </div>

            {/* Bottom Row: Buttons */}
            <div className='flex flex-row flex-wrap gap-2 items-center'>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(p._id);
                  setCopiedId(p._id);
                  setTimeout(() => setCopiedId(null), 1500);
                }}
                className={`whitespace-nowrap px-3 py-1 text-sm rounded border font-bold transition-all duration-200 cursor-pointer ${
                  copiedId === p._id
                    ? 'bg-green-100 border-green-400 text-green-700'
                    : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {copiedId === p._id ? 'Copied!' : 'Copy ID'}
              </button>

              <button
                onClick={() => router.push(`/edit-product?id=${p._id}`)}
                className='whitespace-nowrap bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-1 rounded-md cursor-pointer shadow'
              >
                ✏️ Edit
              </button>

              <button
                disabled={loadingId === p._id}
                className={`whitespace-nowrap px-3 py-1 rounded text-white transition-colors ${
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
        ))}
      </div>
    </div>
  );
}
