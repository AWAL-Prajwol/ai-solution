import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  return formData;
}

// Helper function to convert Web Stream to Buffer
async function streamToBuffer(stream: ReadableStream) {
  const chunks = [];
  const reader = stream.getReader();
  let done = false;
  
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = readerDone;
  }
  
  const buffer = Buffer.concat(chunks);
  return buffer;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await parseFormData(request);
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    
    // Save file to disk
    await fs.promises.writeFile(filePath, buffer);
    
    // Return the URL where the file can be accessed
    const imageUrl = `/uploads/${fileName}`;
    
    console.log(`📁 File uploaded: ${file.name} (${file.size} bytes) -> ${imageUrl}`);
    
    return NextResponse.json({
      url: imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}