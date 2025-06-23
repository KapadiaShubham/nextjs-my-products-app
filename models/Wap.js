import mongoose from 'mongoose';

const WapSchema = new mongoose.Schema(
  {
    rawText: { type: String, required: true },
    sku: { type: String, default: '', index: true },
    priceString: { type: String, default: '' },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);


const Wap = mongoose.models.Wap || mongoose.model('Wap', WapSchema);
export default Wap;