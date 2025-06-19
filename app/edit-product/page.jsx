import { Suspense } from 'react';
import EditProduct from './EditProduct'; // This is already a 'use client' component

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading Edit Page...</div>}>
      <EditProduct />
    </Suspense>
  );
}
