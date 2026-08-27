import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  try {
    const { modulId, levelId } = await params;
    const filePath = path.join(process.cwd(), 'data', modulId, levelId, 'games.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
}
