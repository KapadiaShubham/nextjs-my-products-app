import { connectDB } from '@/lib/db';
import Wap from '@/models/Wap';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { rawText, sku, priceString, images } = await req.json();

  if (!rawText) {
    return NextResponse.json({ error: 'rawText is required' }, { status: 400 });
  }

  const newWap = await Wap.create({
    rawText,
    sku: sku || '',
    priceString: priceString || '',
    images: Array.isArray(images) ? images : [],
  });

  return NextResponse.json(newWap);
}

export async function GET(req) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const waps = await Wap.find().sort({ createdAt: -1 });
  return NextResponse.json(waps);
}
