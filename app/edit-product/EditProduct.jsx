'use client';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function EditProduct() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

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
  const [existingImage, setExistingImage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const fields = [
    { id: 'sku', label: 'Product SKU', placeholder: 'e.g. Dhunki 001' },
    { id: 'price', label: 'Price (₹)', placeholder: 'e.g. 499', type: 'number' },
    { id: 'priceStr', label: 'Price Text', placeholder: 'e.g. ₹499 + GST' },
    { id: 'color', label: 'Color', placeholder: 'e.g. Black' },
    { id: 'fabric', label: 'Fabric', placeholder: 'e.g. Premium Georgette' },
    { id: 'specialty', label: 'Specialty', placeholder: 'e.g. Embroidered Neck' },
    { id: 'sizes', label: 'Available Sizes', placeholder: 'e.g. M, L, XL' },
    { id: 'sleeveType', label: 'Sleeve Type', placeholder: 'e.g. Full Sleeve' },
    { id: 'catalogue', label: 'Catalogue', placeholder: 'e.g. 4 PCS' },
    { id: 'gst5Percent', label: 'GST 5%', placeholder: 'e.g. Extra' },
    { id: 'singleAvailable', label: 'Single Available?', placeholder: 'e.g. Yes / No' },
  ];

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/products');
      const data = await res.json();
      const product = data.find((p) => p._id === id);
      if (product) {
        setForm({
          sku: product.sku,
          price: product.price,
          priceStr: product.priceStr,
          color: product.color,
          fabric: product.fabric,
          specialty: product.specialty,
          sizes: product.sizes,
          sleeveType: product.sleeveType,
          catalogue: product.catalogue,
          gst5Percent: product.gst5Percent,
          singleAvailable: product.singleAvailable,
          type: product.type,
        });
        setExistingImage(product.imageUrl);
      }
    }

    if (id) loadData();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setSaving(true);

    let imageUrl = existingImage;

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
      imageUrl = data.secure_url;
    }

    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: id,
        ...form,
        price: parseInt(form.price),
        imageUrl,
      }),
    });

    router.push('/all-products');
  };

  return (
    <div className='bg-gradient-to-br from-gray-100 to-blue-50 px-4 pt-16 pb-10 min-h-screen'>
      <div className='bg-white px-4 py-6 sm:px-6 sm:py-10 max-w-lg mx-auto rounded-xl shadow-md'>
        <h1 className='text-3xl font-bold text-blue-600 mb-6 text-center'>Edit Product ✏️</h1>

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
            <label htmlFor='type' className='block text-sm font-semibold text-gray-700 mb-1'>Type</label>
            <select
              id='type'
              value={form.type}
              onChange={handleChange}
              className='w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition'
            >
              <option value=''>Select Type</option>
              <option value='Long Dress'>Long Dress</option>
              <option value='Kurti'>Kurti</option>
              <option value='Gown'>Gown</option>
              <option value='Saree'>Saree</option>
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Product Image</label>

            {existingImage && !imagePreview && (
              <div className='mb-2'>
                <img src={existingImage} alt='Current' className='h-40 rounded shadow-md mx-auto' />
                <p className='text-sm text-gray-500 mt-1 text-center'>Current image. Upload new to replace.</p>
              </div>
            )}

            {imagePreview && (
              <img src={imagePreview} alt='Preview' className='h-40 rounded shadow-md mx-auto mb-2' />
            )}

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
              id='customFile'
            />

            <label
              htmlFor='customFile'
              className='inline-block bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded cursor-pointer'
            >
              Choose File
            </label>

            {image ? (
              <span className='ml-2 text-gray-700 text-sm'>{image.name}</span>
            ) : (
              <span className='ml-2 text-gray-500 text-sm'>No file chosen</span>
            )}

            {image && (
              <button
                onClick={removeImage}
                className='mt-2 inline-flex items-center gap-1 text-sm text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-100 hover:text-red-700 transition-colors duration-200 cursor-pointer'
              >
                ❌ Remove New Image
              </button>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`mt-4 w-full px-4 py-2 rounded text-white transition ${
              saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ id, label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-semibold text-gray-700 mb-1'>
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
