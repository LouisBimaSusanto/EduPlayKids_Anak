import { NextResponse } from "next/server";

// GET: Fetch masterclass videos and articles
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'video' | 'article' | 'all'

  // TODO: Query from Headless CMS or Real Database
  // const contents = await db.contents.getMany({ type });

  const mockVideos = [
    { id: "vid_1", title: "Seni Menghadapi Anak Tantrum", duration: "08:15", category: "Psikologi" },
    { id: "vid_2", title: "Panduan Mengajar Fonik", duration: "12:30", category: "Pendidikan" }
  ];

  const mockArticles = [
    { id: "art_1", title: "Nutrisi Emas Perkembangan Otak", read_time: "3 min", author: "dr. Karin" },
    { id: "art_2", title: "Permainan Pembangun Kosakata", read_time: "4 min", author: "Eduplay Team" }
  ];

  return NextResponse.json({
    status: "success",
    data: {
      videos: type === 'article' ? [] : mockVideos,
      articles: type === 'video' ? [] : mockArticles,
    }
  });
}
