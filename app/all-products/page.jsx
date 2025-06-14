// 6. app/all-products/page.jsx
'use client';
import { useEffect, useState } from 'react';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
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
          // <div key={p._id} className="border p-4 rounded-xl shadow">
          //   <p><strong>SKU:</strong> {p.sku}</p>
          //   <p><strong>Price:</strong> {p.price}</p>
          //   <p><strong>Color:</strong> {p.color}</p>
          //   {p.imageUrl && <img src={p.imageUrl} className="w-32 h-32 object-cover my-2" />}
          //   {p.imageUrl && <a href={p.imageUrl} className="text-blue-500 text-sm" target="_blank">View Image</a>}
          //   <button className="bg-gray-200 px-2 py-1 text-sm mt-2" onClick={() => copyId(p._id)}>Copy ID</button>
          // </div>
          <div key={p._id} className='border rounded p-4 shadow'>
            <p>
              <strong>SKU:</strong> {p.sku}
            </p>
            <p>
              <strong>Price:</strong> {p.price}
            </p>
            <p>
              <strong>Color:</strong> {p.color}
            </p>
            {p.imageUrl && (
              <>
                <img
                  src={p.imageUrl}
                  alt='Product'
                  className='w-32 h-32 object-cover mt-2'
                />
                {/* <p className='text-sm text-blue-600 break-all'>
                  {p.imageUrl}
                </p> */}
              </>
            )}

            <button
              disabled={loadingId === p._id}
              className={`mt-2 px-3 py-1 rounded text-white transition-colors ${
                loadingId === p._id
                  ? 'bg-gray-400 cursor-not-allowed'
                  : p.deleteRequest
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={async () => {
                setLoadingId(p._id); // start loading

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

                setLoadingId(null); // stop loading
              }}
            >
              {loadingId === p._id
                ? <><span className="animate-spin mr-2">⏳</span>Processing...</>
                : p.deleteRequest
                ? 'Cancel Delete'
                : 'Request Delete'}
            </button>

            <button
              className='mt-2 ml-2 text-sm text-gray-600 underline'
              onClick={() => {
                navigator.clipboard.writeText(p._id);
              }}
            >
              Copy ID
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
