// app/api/products/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return Response.json(products);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const newProduct = await Product.create({ ...body, deleteRequest: false }); // ensure deleteRequest is set
  return Response.json(newProduct);
}

export async function PUT(req) {
  await connectDB();
  const body = await req.json();
  const { _id, ...updateFields } = body;

  if (!_id) {
    return new Response(JSON.stringify({ error: "_id is required" }), {
      status: 400,
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(_id, updateFields, {
    new: true,
  });
  
  if (!updatedProduct) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }
  return Response.json(updatedProduct);
}