import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

export async function extractPdfText(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'uploads', filename);
  const buffer = fs.readFileSync(filePath);

  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();

  return (result.text || '').trim();
}