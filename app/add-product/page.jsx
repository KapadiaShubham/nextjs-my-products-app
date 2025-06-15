'use client';
import { useState, useRef } from 'react';

export default function AddProduct() {
  const [form, setForm] = useState({
    sku: '',
    price: '',
    priceStr: '',
    color: '',
    fabric: '',
    specialty: '',
    sizes: '',
    sleeveType: '',
    catalogue: '',
    gst5Percent: '',
    singleAvailable: '',
    type: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const fields = [
    { id: 'sku', label: 'Product SKU', placeholder: 'e.g. Dhunki 001' },
    {
      id: 'price',
      label: 'Price (₹)',
      placeholder: 'e.g. 499',
      type: 'number',
    },
    { id: 'priceStr', label: 'Price Text', placeholder: 'e.g. ₹499 + GST' },
    { id: 'color', label: 'Color', placeholder: 'e.g. Black' },
    { id: 'fabric', label: 'Fabric', placeholder: 'e.g. Premium Georgette' },
    {
      id: 'specialty',
      label: 'Specialty',
      placeholder: 'e.g. Embroidered Neck',
    },
    { id: 'sizes', label: 'Available Sizes', placeholder: 'e.g. M, L, XL' },
    { id: 'sleeveType', label: 'Sleeve Type', placeholder: 'e.g. Full Sleeve' },
    { id: 'catalogue', label: 'Catalogue', placeholder: 'e.g. 4 PCS' },
    { id: 'gst5Percent', label: 'GST 5%', placeholder: 'e.g. Extra' },
    {
      id: 'singleAvailable',
      label: 'Single Available?',
      placeholder: 'e.g. Yes / No',
    },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearForm = () => {
    setSku('');
    setPrice('');
    setColor('');
    removeImage();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);

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
      body: JSON.stringify({
        sku,
        fabric,
        color,
        imageUrl,
        specialty,
        priceStr,
        price: parseInt(price),
        sizes,
        sleeveType,
        catalogue,
        gst5Percent,
        singleAvailable,
        type,
      }),
    });

    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    clearForm();
  };

  return (
    <div className='bg-gradient-to-br from-gray-100 to-blue-50 px-4 pt-16 pb-10 min-h-screen'>
      {/* <div className='w-full max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-2xl'> */}
      <div className='bg-white px-4 py-6 sm:px-6 sm:py-10 max-w-lg mx-auto rounded-xl shadow-md'>
        <h1 className='text-3xl font-bold text-blue-600 mb-6 text-center'>
          Add New Product 🛍️
        </h1>

        <div className='space-y-5'>
          {fields.map(({ id, label, placeholder, type }) => (
            <InputField
              key={id}
              id={id}
              label={label}
              placeholder={placeholder}
              type={type}
              value={form[id]}
              onChange={handleChange}
            />
          ))}

          <div>
            <label
              htmlFor='type'
              className='block text-sm font-semibold text-gray-700 mb-1'
            >
              Type
            </label>
            <select
              id='type'
              value={form.type}
              onChange={handleChange}
              className='w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition'
            >
              <option value=''>Select Type</option>
              <option value='longDress'>Long Dress</option>
              <option value='kurti'>Kurti</option>
              <option value='gown'>Gown</option>
              <option value='saree'>Saree</option>
              {/* Add more types as needed */}
            </select>
          </div>

          {/* Image Upload */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Product Image
            </label>

            {/* Only clickable when imagePreview is null */}
            <div
              onClick={() => {
                if (!imagePreview) fileInputRef.current?.click();
              }}
              className={`w-full border-2 border-dashed p-3 rounded-lg text-center flex items-center justify-center transition ${
                imagePreview
                  ? 'border-gray-300 bg-gray-100 cursor-default h-48'
                  : 'border-blue-300 hover:bg-blue-50 cursor-pointer hover:border-blue-400'
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='h-full max-w-[60%] object-contain rounded-md shadow-sm'
                />
              ) : (
                <span className='text-blue-400 font-medium'>
                  Click to upload image
                </span>
              )}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className='hidden'
              />
            </div>

            {image && (
              <button
                onClick={removeImage}
                className='mt-3 inline-block px-4 py-1.5 text-sm font-medium text-red-600 bg-red-50 cursor-pointer hover:bg-red-100 border border-red-200 rounded-md transition'
              >
                Remove Image
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className='flex gap-3 justify-between'>
            <button
              onClick={clearForm}
              className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition'
            >
              Clear All
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2 rounded-md transition text-white ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <>
                  <span className='animate-spin'>🔄</span> Saving...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>

          {success && (
            <div className='mt-4 p-3 rounded-md bg-green-100 border border-green-300 text-green-800 font-semibold text-center animate-fade-in'>
              ✅ Product added successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-semibold text-gray-700 mb-1'
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className='w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:ring-2 focus:ring-blue-300 outline-none transition'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
