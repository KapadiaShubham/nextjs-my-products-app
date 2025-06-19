export default function ProductInfo({ product }) {
  return (
    <div className="flex-1 space-y-1 text-sm text-gray-800">
      {[
        ['SKU', product.sku],
        ['Price', `₹${product.price} (${product.priceStr})`],
        ['Color', product.color],
        ['Fabric', product.fabric],
        ['Specialty', product.specialty],
        ['Sizes', product.sizes],
        ['Sleeve Type', product.sleeveType],
        ['Catalogue', product.catalogue],
        ['GST 5%', product.gst5Percent],
        ['Single Available', product.singleAvailable],
        ['Type', product.type],
      ].map(([label, value]) => (
        <p key={label}>
          <strong>{label}:</strong> {value || '—'}
        </p>
      ))}
    </div>
  );
}
