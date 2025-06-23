'use client';
import { useState } from 'react';

export default function WapForm() {
  const [rawText, setRawText] = useState('');
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  function extractField(text, fieldName) {
    const regex = new RegExp(`\\*?${fieldName}\\s*:?[\\s*]*(.+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  function formatWhatsAppText(text) {
    return text
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~(.*?)~/g, '<s>$1</s>')
      .replace(/\n/g, '<br>');
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  }

  function handleRemoveImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'product_upload_preset'); // change
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const sku = extractField(rawText, 'sku');
    const priceString = extractField(rawText, 'price');

    const imageUrls = [];
    for (const img of images) {
      const url = await uploadToCloudinary(img);
      imageUrls.push(url);
    }

    await fetch('/api/waps', {
      method: 'POST',
      body: JSON.stringify({ rawText, sku, priceString, images: imageUrls }),
      headers: { 'Content-Type': 'application/json' },
    });

    setRawText('');
    setImages([]);
    setSaving(false);
  }

  const sku = extractField(rawText, 'sku');
  const priceString = extractField(rawText, 'price');

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={10}
          className="w-full p-3 border rounded-md"
          placeholder="Paste WhatsApp product info here..."
        />

        {/* Images */}
        <div className="space-y-2">
          <label className="font-semibold">Images</label>
          <div className="flex flex-wrap gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded shadow"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save WAP'}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-bold">Live Preview:</h2>
        <div
          className="p-4 border rounded bg-gray-50"
          dangerouslySetInnerHTML={{ __html: formatWhatsAppText(rawText) }}
        />
        {sku && <p><strong>SKU:</strong> {sku}</p>}
        {priceString && <p><strong>Price:</strong> {priceString}</p>}
      </div>
    </div>
  );
}
