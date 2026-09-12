// POST /api/vote  body: { org, orgCode, bu, dept, name, codes:[5], ts }
// 구글 Apps Script로 전달 → 시트에 1줄 기록 + 중복(기관·부서·이름) 차단 + 집계 반환
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method' }); return; }
  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const r = await fetch(process.env.SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      redirect: 'follow',
    });
    const data = await r.json();   // { ok:true, counts } 또는 { error:'dup' }
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json({ error: String(e) });
  }
}
