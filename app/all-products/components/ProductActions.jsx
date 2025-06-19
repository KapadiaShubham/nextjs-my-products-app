'use client';
import { useRouter } from 'next/navigation';

export default function ProductActions({
  product,
  copiedId,
  setCopiedId,
  loadingId,
  setLoadingId,
  setProducts,
}) {
  const router = useRouter();

  const handleDeleteToggle = async () => {
    setLoadingId(product._id);
    const res = await fetch('/api/products/patch', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: product._id,
        deleteRequest: !product.deleteRequest,
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
  };

  return (
    <div className="flex flex-row flex-wrap gap-2 items-center">
      <button
        onClick={() => {
          navigator.clipboard.writeText(product._id);
          setCopiedId(product._id);
          setTimeout(() => setCopiedId(null), 1500);
        }}
        className={`whitespace-nowrap px-3 py-1 text-sm rounded border font-bold transition-all duration-200 cursor-pointer ${
          copiedId === product._id
            ? 'bg-green-100 border-green-400 text-green-700'
            : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
        }`}
      >
        {copiedId === product._id ? 'Copied!' : 'Copy ID'}
      </button>

      <button
        onClick={() => router.push(`/edit-product?id=${product._id}`)}
        className="whitespace-nowrap bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-1 rounded-md cursor-pointer shadow"
      >
        ✏️ Edit
      </button>

      <button
        disabled={loadingId === product._id}
        className={`whitespace-nowrap px-3 py-1 rounded text-white transition-colors ${
          loadingId === product._id
            ? 'bg-gray-400 cursor-not-allowed'
            : product.deleteRequest
            ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
            : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
        }`}
        onClick={handleDeleteToggle}
      >
        {loadingId === product._id ? (
          <>
            <span className="animate-spin mr-2">⏳</span>Processing...
          </>
        ) : product.deleteRequest ? (
          'Cancel Delete'
        ) : (
          'Request Delete'
        )}
      </button>
    </div>
  );
}
