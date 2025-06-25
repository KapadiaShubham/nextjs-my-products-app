'use client';
import { useState } from 'react';

function removeEmptyLines(text) {
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');
}

export default function WapForm() {
  const [rawText, setRawText] = useState('');
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // percentage from 0–100

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

  const [imageProgress, setImageProgress] = useState(images.map(() => 0));

  async function uploadToCloudinary(file, index) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'product_upload_preset');

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          setImageProgress((prev) => {
            const updated = [...prev];
            updated[index] = percent;
            return updated;
          });
        }
      });

      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText);
        xhr.status === 200
          ? resolve(res.secure_url)
          : reject(new Error(res.error?.message || 'Upload failed'));
      };

      xhr.onerror = () => reject(new Error('Network error'));

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
      );
      xhr.send(formData);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const sku = extractField(rawText, 'sku');
    const priceString = extractField(rawText, 'price');

    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const url = await uploadToCloudinary(images[i], i, images.length);
      imageUrls.push(url);
    }

    await fetch('/api/waps', {
      method: 'POST',
      body: JSON.stringify({
        rawText: removeEmptyLines(rawText),
        sku,
        priceString,
        images: imageUrls,
      }),

      headers: { 'Content-Type': 'application/json' },
    });

    setRawText('');
    setImages([]);
    setSaving(false);
  }

  const sku = extractField(rawText, 'sku');
  const priceString = extractField(rawText, 'price');

  return (
    <div className='p-4 max-w-2xl mx-auto'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={10}
          className='w-full p-3 border rounded-md'
          placeholder='Paste WhatsApp product info here...'
        />

        {/* Images */}
        <div className='space-y-2'>
          <label className='font-semibold'>Images</label>
          <div className='flex flex-wrap gap-4'>
            {images.map((file, index) => (
              <div key={index} className='relative'>
                <img
                  src={URL.createObjectURL(file)}
                  alt='preview'
                  className='w-24 h-24 object-cover rounded shadow'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs'
                >
                  ×
                </button>
                {saving && (
                  <div className='absolute bottom-0 left-0 w-full h-1 bg-gray-300 rounded'>
                    <div
                      className='h-full bg-blue-500 rounded'
                      style={{ width: `${imageProgress[index] || 0}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Hidden Input */}
          <input
            id='image-upload'
            type='file'
            accept='image/*'
            multiple
            onChange={handleImageChange}
            className='hidden'
          />

          {/* Custom Button */}
          <label
            htmlFor='image-upload'
            className='inline-block cursor-pointer bg-blue-100 text-blue-800 px-4 py-2 rounded-md border border-blue-300 hover:bg-blue-200 transition duration-200'
          >
            + Choose Images
          </label>

          {/* Optional: List of selected file names */}
          {images.length > 0 && (
            <div className='text-sm text-gray-600 mt-1'>
              {images.map((file, idx) => (
                <div key={idx}>{file.name}</div>
              ))}
            </div>
          )}
        </div>

        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save WAP'}
        </button>
      </form>

      <div className='mt-6 space-y-2'>
        <h2 className='text-lg font-bold'>Live Preview:</h2>
        <div
          className='p-4 border rounded bg-gray-50'
          dangerouslySetInnerHTML={{
            __html: formatWhatsAppText(removeEmptyLines(rawText)),
          }}
        />
        {sku && (
          <p>
            <strong>SKU:</strong> {sku}
          </p>
        )}
        {priceString && (
          <p>
            <strong>Price:</strong> {priceString}
          </p>
        )}
      </div>
    </div>
  );
}
