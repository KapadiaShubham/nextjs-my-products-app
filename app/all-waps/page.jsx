'use client';
import { useEffect, useState } from 'react';

function formatWhatsAppText(text) {
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/~(.*?)~/g, '<s>$1</s>')
    .replace(/\n/g, '<br>');
}

export default function AllWaps() {
  const [waps, setWaps] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Add this

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);

  useEffect(() => {
    fetch('/api/waps')
      .then((res) => res.json())
      .then((data) => {
        setWaps(data);
        setLoading(false); // 👈 stop loading after fetch
      });
  }, []);

  const filteredWaps = waps.filter((wap) => {
    const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
    const fullText =
      `${wap.rawText} ${wap.sku} ${wap.priceString}`.toLowerCase();
    return terms.every((term) => fullText.includes(term));
  });

  const selectedWap = filteredWaps[selectedIndex] || null;

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-75px)]'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600'></div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className='hidden md:flex h-[calc(100vh-75px)]'>
        {/* Sidebar */}
        <div className='w-1/3 border-r bg-gray-100 flex flex-col overflow-hidden'>
          {/* Sticky Search */}
          <div className='sticky top-0 bg-gray-100 z-10 p-2 border-b'>
            <div className='relative'>
              <input
                type='text'
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder='Search SKU, Price or Text...'
                className='w-full p-2 pr-8 border rounded'
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-lg'
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className='flex-1 overflow-y-auto p-2 scrollbar-hidden'>
            {filteredWaps.length === 0 ? (
              <p className='text-sm text-gray-500 p-4'>No results found.</p>
            ) : (
              filteredWaps.map((wap, i) => (
                <div
                  key={wap._id}
                  onClick={() => setSelectedIndex(i)}
                  className={`cursor-pointer p-3 mb-2 rounded flex items-center justify-between hover:bg-gray-200 ${
                    i === selectedIndex ? 'bg-white shadow' : ''
                  }`}
                >
                  <div className='text-sm'>
                    <div>
                      <strong>SKU:</strong> {wap.sku || 'N/A'}
                    </div>
                    <div>
                      <strong>Images:</strong> {wap.images.length}
                    </div>
                    <div>
                      <strong>Price:</strong> {wap.priceString || 'N/A'}
                    </div>
                  </div>
                  <span className='text-gray-400 text-lg'>➜</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details */}
        <div className='w-2/3 p-6 overflow-y-auto scrollbar-hidden flex md:flex-row'>
          {selectedWap ? (
            <>
              <div
                className='prose max-w-none w-3/5'
                dangerouslySetInnerHTML={{
                  __html: formatWhatsAppText(selectedWap.rawText),
                }}
              />
              <div className='flex flex-wrap gap-4 content-start w-2/5'>
                {selectedWap.images.map((url, i) => (
                  <div key={i} className='w-33 h-44'>
                    <img
                      src={url}
                      alt='img'
                      className='h-full w-full object-cover'
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className='text-gray-600 text-sm'>No product selected.</p>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='md:hidden'>
        {!showDetailsMobile ? (
          <div className='px-4 space-y-4 scrollbar-hidden'>
            {/* Search */}
            <div className='sticky top-[107px] z-10 bg-white pb-4 pt-4'>
              <div className='relative'>
                <input
                  type='text'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder='Search SKU, Price or Text...'
                  className='w-full p-2 pr-8 border rounded'
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-lg'
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            {filteredWaps.map((wap, i) => (
              <div
                key={wap._id}
                onClick={() => {
                  setSelectedIndex(i);
                  setShowDetailsMobile(true);
                }}
                className='p-3 border rounded shadow cursor-pointer'
              >
                <div>
                  <strong>SKU:</strong> {wap.sku || 'N/A'}
                </div>
                <div>
                  <strong>Images:</strong> {wap.images.length}
                </div>
                <div>
                  <strong>Price:</strong> {wap.priceString || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='p-4'>
            <button
              onClick={() => setShowDetailsMobile(false)}
              className='mb-4 text-blue-600 font-semibold'
            >
              ← Back
            </button>
            <div
              className='prose max-w-none'
              dangerouslySetInnerHTML={{
                __html: formatWhatsAppText(selectedWap.rawText),
              }}
            />
            <div className='flex flex-wrap gap-2 mt-4'>
              {selectedWap.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt='img'
                  className='w-24 h-24 object-cover rounded'
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
