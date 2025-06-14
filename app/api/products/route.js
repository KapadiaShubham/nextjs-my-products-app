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
