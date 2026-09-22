// 투표 접수 API — 비활성화됨
//
// 워크숍 종료 후 사이트를 자료집 배포용으로 전환하면서 투표 기능을 모두 제거했습니다.
// 화면에서는 이 주소를 호출하지 않지만, 주소를 직접 호출해 표를 넣는 일이 없도록 막아둡니다.
//
// 투표 기록은 구글 시트(ballots)에 그대로 보존되어 있습니다.
// 다시 열려면 이 내용을 지우고 원래 코드로 되돌린 뒤, Vercel 환경변수
// SHEETS_WEBAPP_URL 이 살아있는지 확인하면 됩니다.
export default function handler(req, res) {
  res.status(404).json({ error: 'not found' });
}
