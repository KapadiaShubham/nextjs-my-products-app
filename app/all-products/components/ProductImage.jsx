import { CldImage } from 'next-cloudinary';

export default function ProductImage({ product }) {
  if (!product.imageUrl) return null;

  return (
    <div className="w-40 flex flex-col items-center">
      <CldImage
        src={product.imageUrl}
        alt={`${product.sku} - ${product.color}`}
        width={50}
        height={100}
        className="w-full object-cover"
      />
      <a
        href={product.imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 text-sm mt-2 underline cursor-pointer"
      >
        View Image
      </a>
    </div>
  );
}
