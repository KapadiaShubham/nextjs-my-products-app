'use client';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import WapList from './components/WapList';
import WapDetails from './components/WapDetails';
import MobileDetails from './components/MobileDetails';

export default function AllWaps() {
  const [waps, setWaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);

  useEffect(() => {
    fetch('/api/waps')
      .then((res) => res.json())
      .then((data) => {
        setWaps(data);
        setLoading(false);
      });
  }, []);

  const filteredWaps = waps.filter((wap) => {
    const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
    const fullText = `${wap.rawText} ${wap.sku} ${wap.priceString}`.toLowerCase();
    return terms.every((term) => fullText.includes(term));
  });

  const selectedWap = filteredWaps[selectedIndex] || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-75px)]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-[calc(100vh-75px)]">
        <div className="w-1/3 border-r bg-gray-100 flex flex-col overflow-hidden">
          <div className="sticky top-0 bg-gray-100 z-10 p-2 border-b">
            <SearchBar search={search} setSearch={(val) => { setSearch(val); setSelectedIndex(0); }} />
          </div>
          <WapList waps={filteredWaps} onSelect={setSelectedIndex} selectedIndex={selectedIndex} />
        </div>
        <div className="w-2/3 p-6 overflow-y-auto scrollbar-hidden flex md:flex-row">
          {selectedWap ? <WapDetails wap={selectedWap} /> : <p className="text-gray-600 text-sm">No product selected.</p>}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {!showDetailsMobile ? (
          <div className="px-4 space-y-4 scrollbar-hidden">
            <div className="sticky top-[107px] z-10 bg-white pb-4 pt-4">
              <SearchBar search={search} setSearch={(val) => { setSearch(val); setSelectedIndex(0); }} />
            </div>
            {filteredWaps.map((wap, i) => (
              <div
                key={wap._id}
                onClick={() => { setSelectedIndex(i); setShowDetailsMobile(true); }}
                className="p-3 border rounded shadow cursor-pointer"
              >
                <div><strong>SKU:</strong> {wap.sku || 'N/A'}</div>
                <div><strong>Images:</strong> {wap.images.length}</div>
                <div><strong>Price:</strong> {wap.priceString || 'N/A'}</div>
              </div>
            ))}
          </div>
        ) : (
          selectedWap && <MobileDetails wap={selectedWap} back={() => setShowDetailsMobile(false)} />
        )}
      </div>
    </>
  );
}
