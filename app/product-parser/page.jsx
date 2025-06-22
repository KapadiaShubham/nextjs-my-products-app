'use client';
import { useState } from 'react';

export default function ProductParserPage() {
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const handleParse = () => {
    const lines = rawText
      .split('\n')
      .map((l) => l.replace(/\s*:\s*/, ':').trim()) // normalize "Field : value" → "Field:value"
      .filter(Boolean);

    const data = {
      category: '',
      brand: '',
      sku: '',
      fabric: '',
      speciality: '',
      price_per_piece: null,
      pieces_in_catalogue: null,
      total_price: null,
      gst_percent: 5,
      size: [],
      sleeve: '',
      neck: '',
      colors: '',
      stitched_type: '',
      wash_care: '',
      single_available: false,
      limited_edition: false,
      extra_text: [],
      meta_notes: [],
    };

    for (const line of lines) {
      const lower = line.toLowerCase();

      if (lower.includes('brand:')) {
        data.brand = line.split(':')[1]?.trim();
      } else if (lower.startsWith('sku:')) {
        data.sku = line.split(':')[1]?.trim();
      } else if (lower.startsWith('fabric:')) {
        data.fabric = line.split(':')[1]?.trim();
      } else if (lower.startsWith('speciality:')) {
        data.speciality = line.split(':')[1]?.trim();
      } else if (lower.startsWith('price:')) {
        const match = line.match(/₹?(\d+)[^\d]*(\d+)?/);
        data.price_per_piece = match ? parseInt(match[1]) : null;
        const totalMatch = line.match(/=\s*₹?(\d+)/);
        data.total_price = totalMatch ? parseInt(totalMatch[1]) : null;
      } else if (lower.includes('plus gst')) {
        const match = line.match(/gst\s*(\d+)%/);
        data.gst_percent = match ? parseInt(match[1]) : 5;
      } else if (lower.startsWith('colors')) {
        const match = line.match(/(\d+)/);
        data.colors = match ? parseInt(match[1]) : '';
      } else if (lower.startsWith('size')) {
        const sizes = line.split(':')[1]?.trim().split(',') ?? [];
        data.size = sizes.map((s) => s.trim());
      } else if (lower.includes('stitched')) {
        data.stitched_type = line.split(':')[1]?.trim();
      } else if (lower.startsWith('sleeve')) {
        data.sleeve = line.split(':')[1]?.trim();
      } else if (lower.startsWith('neck')) {
        data.neck = line.split(':')[1]?.trim();
      } else if (lower.includes('wash care')) {
        data.wash_care = line.split('wash care')[1]?.trim();
      } else if (lower.includes('single not available')) {
        data.single_available = false;
      } else if (lower.includes('limited edition')) {
        data.limited_edition = true;
      } else if (lower.includes('catalogue')) {
        const pcs = line.match(/(\d+)\s*pcs/i);
        data.pieces_in_catalogue = pcs ? parseInt(pcs[1]) : null;
        data.meta_notes.push(line);
      } else if (
        lower.includes('exclusive') ||
        lower.includes('designer') ||
        lower.includes('💃🏼')
      ) {
        data.extra_text.push(line);
      }
    }

    setParsedData(data);
  };

  const handleInputChange = (key, value) => {
    setParsedData((prev) => ({ ...prev, [key]: value }));
  };

  const InputField = ({ label, value, onChange }) => (
    <div className='flex flex-col'>
      <label className='font-medium capitalize'>
        {label.replace(/_/g, ' ')}
      </label>
      <input
        type='text'
        value={value ?? ''}
        onChange={(e) => onChange(label, e.target.value)}
        className='border rounded px-3 py-2'
      />
    </div>
  );

  const ToggleField = ({ label, value, onChange }) => (
    <div className='flex items-center space-x-3'>
      <label className='font-medium capitalize'>
        {label.replace(/_/g, ' ')}
      </label>
      <input
        type='checkbox'
        checked={value}
        onChange={(e) => onChange(label, e.target.checked)}
        className='w-5 h-5'
      />
    </div>
  );

  const TextareaField = ({ label, value, onChange }) => (
    <div className='flex flex-col'>
      <label className='font-medium capitalize'>
        {label.replace(/_/g, ' ')}
      </label>
      <textarea
        value={value?.join('\n')}
        onChange={(e) => onChange(label, e.target.value.split('\n'))}
        className='w-full border rounded px-3 py-2'
        rows={3}
      />
    </div>
  );

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>📦 Product Text Parser</h1>
      <textarea
        className='w-full h-60 p-4 border rounded-md mb-4'
        placeholder='Paste product description here...'
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      ></textarea>
      <button
        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6'
        onClick={handleParse}
      >
        Parse Product Details
      </button>

      {parsedData && (
        <form className='space-y-8'>
          {/* BASIC INFO */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>📦 Basic Info</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {['category', 'brand', 'sku'].map((key) => (
                <InputField
                  key={key}
                  label={key}
                  value={parsedData[key]}
                  onChange={handleInputChange}
                />
              ))}
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>👗 Product Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                'fabric',
                'speciality',
                'stitched_type',
                'sleeve',
                'neck',
                'wash_care',
              ].map((key) => (
                <InputField
                  key={key}
                  label={key}
                  value={parsedData[key]}
                  onChange={handleInputChange}
                />
              ))}
            </div>
          </div>

          {/* SIZES AND COLORS */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>📏 Sizes & Colors</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
                label='size'
                value={parsedData.size?.join(', ')}
                onChange={(k, v) =>
                  handleInputChange(
                    'size',
                    v.split(',').map((s) => s.trim())
                  )
                }
              />
              <InputField
                label='colors'
                value={parsedData.colors}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* PRICING */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>💰 Pricing</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                'price_per_piece',
                'pieces_in_catalogue',
                'total_price',
                'gst_percent',
              ].map((key) => (
                <InputField
                  key={key}
                  label={key}
                  value={parsedData[key]}
                  onChange={handleInputChange}
                />
              ))}
            </div>
          </div>

          {/* FLAGS */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>
              ✅ Availability & Tags
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <ToggleField
                label='single_available'
                value={parsedData.single_available}
                onChange={handleInputChange}
              />
              <ToggleField
                label='limited_edition'
                value={parsedData.limited_edition}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* EXTRA TEXTS */}
          <div>
            <h2 className='text-xl font-semibold mb-4'>📝 Extra Notes</h2>
            <div className='space-y-4'>
              <TextareaField
                label='extra_text'
                value={parsedData.extra_text}
                onChange={handleInputChange}
              />
              <TextareaField
                label='meta_notes'
                value={parsedData.meta_notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
