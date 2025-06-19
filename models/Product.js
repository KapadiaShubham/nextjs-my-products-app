// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    sku: String,
    fabric: String,
    color: String,
    imageUrl: String,
    specialty: String,
    priceStr: String,
    price: Number,
    sizes: String,
    sleeveType: String,
    catalogue: String,
    gst5Percent: String,
    singleAvailable: String,
    type: String,
    deleteRequest: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
