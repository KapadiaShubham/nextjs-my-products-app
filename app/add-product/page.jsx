// 5. app/add-product/page.jsx
'use client';
import { useState, useRef } from 'react';

export default function AddProduct() {
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearForm = () => {
    setSku('');
    setPrice('');
    setColor('');
    removeImage(); // also resets file input
  };

  const handleSubmit = async () => {
    setSaving(true); // 🔁 Start loading

    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'product_upload_preset');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      imageUrl = data.secure_url || '';
    }

    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, price, color, imageUrl }),
    });

    setSaving(false); // ✅ Stop loading
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    removeImage(); // clears image + file input
  };

  return (
    <div className='max-w-md mx-auto p-4'>
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
  🛒 Add Product
</h1>



      <div className='mb-5'>
        <label
          htmlFor='sku'
          className='block text-base font-semibold text-gray-800 mb-2'
        >
          Product SKU
        </label>
        <input
          id='sku'
          type='text'
          className='w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder='e.g. TSHIRT001'
        />
      </div>

      <div className='mb-5'>
        <label
          htmlFor='price'
          className='block text-base font-semibold text-gray-800 mb-2'
        >
          Price (₹)
        </label>
        <input
          id='price'
          type='number'
          className='w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder='e.g. 499'
        />
      </div>

      <div className='mb-5'>
        <label
          htmlFor='color'
          className='block text-base font-semibold text-gray-800 mb-2'
        >
          Color
        </label>
        <input
          id='color'
          type='text'
          className='w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder='e.g. Black'
        />
      </div>

      <div className='mb-2'>
        <label className='inline-block bg-gray-200 px-4 py-2 cursor-pointer rounded text-sm text-gray-700 hover:bg-gray-300'>
          Choose Image
          <input
            type='file'
            onChange={handleImageChange}
            ref={fileInputRef}
            accept='image/*'
            className='hidden'
          />
        </label>

        {image && (
          <span className='ml-2 text-sm text-gray-600'>{image.name}</span>
        )}

        {imagePreview && (
          <img
            src={imagePreview}
            alt='Preview'
            className='w-24 h-24 object-cover mt-2'
          />
        )}

        {image && (
          <button
            onClick={removeImage}
            className='mt-2 inline-flex items-center gap-1 px-3 py-1 text-red-600 bg-red-100 hover:bg-red-200 border border-red-300 rounded-md transition'
          >
            ❌ Remove Image
          </button>
        )}
      </div>

      <div className='flex gap-2'>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`px-4 py-2 rounded text-white transition-colors ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {saving ? (
            <>
              <span className='animate-spin mr-2'>⏳</span>
              Saving...
            </>
          ) : (
            'Save'
          )}
        </button>

        <button className='bg-gray-300 px-4 py-2' onClick={clearForm}>
          Clear
        </button>
      </div>

      {success && (
        <div className='mt-4 p-3 rounded-md bg-green-100 border border-green-300 text-green-800 font-medium flex items-center gap-2 transition-opacity animate-fade-in'>
          ✅ Product added successfully!
        </div>
      )}
    </div>
  );
}
