// app/api/products/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// ✅ Handle PATCH request to toggle deleteRequest
export async function PATCH(req) {
  await connectDB();
  const { id, deleteRequest } = await req.json();

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { deleteRequest },
      { new: true }
    );
    return Response.json(updated);
  } catch (err) {
    return Response.json({ message: "Failed to update" }, { status: 500 });
  }
}
