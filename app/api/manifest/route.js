import manifest from '@/data/manifest.json';
export async function GET() {
  return Response.json(manifest);
}