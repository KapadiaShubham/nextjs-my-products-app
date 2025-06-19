'use client';
import ProductInfo from './ProductInfo';
import ProductImage from './ProductImage';
import ProductActions from './ProductActions';
import { useState } from 'react';

export default function ProductCard({ product, setProducts }) {
  const [copiedId, setCopiedId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  return (
    <div className='border rounded shadow p-4 flex flex-col justify-between h-full space-y-4'>
      <div className='flex gap-4'>
        <ProductInfo product={product} />
        <ProductImage product={product} />
      </div>

      <div className='mt-auto'>
        <ProductActions
          product={product}
          copiedId={copiedId}
          setCopiedId={setCopiedId}
          loadingId={loadingId}
          setLoadingId={setLoadingId}
          setProducts={setProducts}
        />
      </div>
    </div>
  );
}
