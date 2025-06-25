export default function WapList({ waps, onSelect, selectedIndex }) {
  return (
    <div className="flex-1 overflow-y-auto p-2 scrollbar-hidden">
      {waps.length === 0 ? (
        <p className="text-sm text-gray-500 p-4">No results found.</p>
      ) : (
        waps.map((wap, i) => (
          <div
            key={wap._id}
            onClick={() => onSelect(i)}
            className={`cursor-pointer p-3 mb-2 rounded flex items-center justify-between hover:bg-gray-200 ${
              i === selectedIndex ? 'bg-white shadow' : ''
            }`}
          >
            <div className="text-sm">
              <div><strong>SKU:</strong> {wap.sku || 'N/A'}</div>
              <div><strong>Images:</strong> {wap.images.length}</div>
              <div><strong>Price:</strong> {wap.priceString || 'N/A'}</div>
            </div>
            <span className="text-gray-400 text-lg">➜</span>
          </div>
        ))
      )}
    </div>
  );
}
