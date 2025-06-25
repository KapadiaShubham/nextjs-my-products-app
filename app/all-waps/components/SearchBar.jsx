export default function SearchBar({ search, setSearch }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search SKU, Price or Text..."
        className="w-full p-2 pr-8 border rounded"
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-lg"
        >
          ×
        </button>
      )}
    </div>
  );
}
