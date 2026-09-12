// GET /api/votes → { counts: { "농과원-01": 12, ... }, total: 34 }
// 관리자용 집계 조회 (화면에는 노출하지 않고, 필요 시 확인용)
export default async function handler(req, res) {
  try {
    const r = await fetch(process.env.SHEETS_WEBAPP_URL, { redirect: 'follow' });
    const data = await r.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json({ counts: {}, error: String(e) });
  }
}
