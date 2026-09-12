/**
 * 2026 전문연구원 워크숍 · 연구방법론 공유대회 — 투표 기록/집계
 * 구글 시트에 붙는 Apps Script (시트 소유자 권한으로 실행)
 *
 * [설치]
 *  1) 구글 시트 새로 만들기 → 확장 프로그램 → Apps Script
 *  2) 기본 코드 전체 지우고 이 파일 전체 붙여넣기 → 저장(디스크 아이콘)
 *  3) 배포 → 새 배포 → 톱니바퀴에서 "웹 앱" 선택
 *       설명: 아무거나 / 실행 계정: 나 / 액세스 권한: 모든 사용자   ← 반드시 '모든 사용자'
 *     → 배포 → 권한 승인(고급 → 이동 → 허용) → 웹 앱 URL 복사
 *  4) Vercel → Settings → Environment Variables → SHEETS_WEBAPP_URL = 그 URL → Redeploy
 *  5) 시트를 새로고침하면 상단에 "📊 투표 집계" 메뉴가 생깁니다.
 *
 * [시트]
 *  ballots : 투표 원본 (1인 1줄)     tally : 득표 순위표
 */

var SHEET = 'ballots';
var MAX = 5;
var META = {"본청-01":{"o":"본청","d":"농업경영혁신과","a":"양진석, 황윤미"},"농과원-01":{"o":"국립농업과학원","d":"토양물환경과","a":"이단비"},"농과원-02":{"o":"국립농업과학원","d":"재생유기농업과","a":"강지원"},"농과원-03":{"o":"국립농업과학원","d":"재생유기농업과","a":"김종혁"},"농과원-04":{"o":"국립농업과학원","d":"재생유기농업과","a":"이여명"},"농과원-05":{"o":"국립농업과학원","d":"재생유기농업과","a":"이영돈"},"농과원-06":{"o":"국립농업과학원","d":"식물소재바이오공학과","a":"김주형, 이대근"},"농과원-07":{"o":"국립농업과학원","d":"산업곤충과","a":"김찬욱, 장규동, 박민지"},"농과원-08":{"o":"국립농업과학원","d":"산업곤충과","a":"이승현, 박도이, 이경원"},"농과원-09":{"o":"국립농업과학원","d":"산업곤충과","a":"장규동"},"농과원-10":{"o":"국립농업과학원","d":"잔류화학평가과","a":"김소희"},"농과원-11":{"o":"국립농업과학원","d":"잔류화학평가과","a":"신정은"},"농과원-12":{"o":"국립농업과학원","d":"스마트팜개발과","a":"이은주"},"농과원-13":{"o":"국립농업과학원","d":"스마트팜개발과","a":"홍영신, 이재환"},"농과원-14":{"o":"국립농업과학원","d":"수확후관리공학과","a":"강석호, 이주오"},"농과원-15":{"o":"국립농업과학원","d":"수확후관리공학과","a":"오현빈, 최미희"},"농과원-16":{"o":"국립농업과학원","d":"디지털육종지원과","a":"임근묵, 홍준기, 장윤희"},"농과원-17":{"o":"국립농업과학원","d":"슈퍼컴퓨팅센터","a":"장재영"},"농과원-18":{"o":"국립농업과학원","d":"디지털육종지원과","a":"김세원"},"농과원-19":{"o":"국립농업과학원","d":"디지털육종지원과","a":"염완우, 문주연, 소진표"},"농과원-20":{"o":"국립농업과학원","d":"생물안전성과","a":"윤상대, 김은하, 강하정"},"농과원-21":{"o":"국립농업과학원","d":"독성위해평가과","a":"이현준, 이유경"},"식량원-01":{"o":"국립식량과학원","d":"재배생리과","a":"김지훈"},"식량원-02":{"o":"국립식량과학원","d":"스마트생산기술과","a":"배형진"},"식량원-03":{"o":"국립식량과학원","d":"스마트생산기술과","a":"Rameswor Maharjan"},"식량원-04":{"o":"국립식량과학원","d":"스마트생산기술과","a":"Guta Rahel Dinsa"},"식량원-05":{"o":"국립식량과학원","d":"푸드테크소재과","a":"김나연"},"식량원-06":{"o":"국립식량과학원","d":"간척지농업연구센터","a":"김민창"},"식량원-07":{"o":"국립식량과학원","d":"간척지농업연구센터","a":"이세인"},"식량원-08":{"o":"국립식량과학원","d":"맥류작물과","a":"정현진"},"식량원-09":{"o":"국립식량과학원","d":"푸드테크소재과","a":"이현재"},"식량원-10":{"o":"국립식량과학원","d":"작물환경과","a":"Muhammad Farooq"},"식량원-11":{"o":"국립식량과학원","d":"경지이용작물과","a":"김지민, 정승교"},"식량원-12":{"o":"국립식량과학원","d":"푸드테크소재과","a":"남예은"},"식량원-13":{"o":"국립식량과학원","d":"재배생리과","a":"정윤정"},"원예원-01":{"o":"국립원예특작과학원","d":"저장유통과","a":"이진희"},"원예원-02":{"o":"국립원예특작과학원","d":"저장유통과","a":"채승훈, 박도균"},"원예원-03":{"o":"국립원예특작과학원","d":"도시농업과","a":"홍인경"},"원예원-04":{"o":"국립원예특작과학원","d":"도시농업과","a":"추한나"},"원예원-05":{"o":"국립원예특작과학원","d":"도시농업과","a":"정유경"},"원예원-06":{"o":"국립원예특작과학원","d":"도시농업과","a":"심영도"},"원예원-07":{"o":"국립원예특작과학원","d":"온난화대응농업연구소 · 파속채소연구센터","a":"김병혁, 권윤숙, 최정혜"},"원예원-08":{"o":"국립원예특작과학원","d":"과수기초기반과","a":"김유미, 장시형, 박태선"},"원예원-09":{"o":"국립원예특작과학원","d":"과수기초기반과","a":"배선화"},"원예원-10":{"o":"국립원예특작과학원","d":"화훼기초기반과","a":"이호진"},"원예원-11":{"o":"국립원예특작과학원","d":"배연구센터","a":"백윤주"},"원예원-12":{"o":"국립원예특작과학원","d":"배연구센터","a":"황옥진, 마오소핍"},"원예원-13":{"o":"국립원예특작과학원","d":"감귤연구센터","a":"정선아, Awraris Derbie Assefa"},"원예원-14":{"o":"국립원예특작과학원","d":"특용작물육종과","a":"박재완"},"원예원-15":{"o":"국립원예특작과학원","d":"특용작물육종과","a":"안우석"},"축산원-01":{"o":"국립축산과학원","d":"낙농과","a":"김영래"},"축산원-02":{"o":"국립축산과학원","d":"한우연구센터","a":"도한울"},"축산원-03":{"o":"국립축산과학원","d":"낙농과","a":"박정국"},"축산원-04":{"o":"국립축산과학원","d":"난지축산연구센터","a":"Borhan Shokrollahi"},"축산원-05":{"o":"국립축산과학원","d":"동물복지과","a":"장세연, 정원용"},"축산원-06":{"o":"국립축산과학원","d":"동물복지과","a":"정운경"}};

/** 시트 상단 전용 메뉴 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('📊 투표 집계')
    .addItem('집계표 만들기 / 새로고침', '집계표_만들기')
    .addItem('참여 현황 보기', '참여현황')
    .addToUi();
}

function doGet(e) { return jsonOut({ counts: tally(), total: countBallots() }); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (err) { return jsonOut({ error: 'busy' }); }
  try {
    var b = JSON.parse(e.postData.contents);
    if (!b.org || !b.dept || !b.name || !b.codes || !b.codes.length) return jsonOut({ error: 'invalid' });
    var sh = sheet();
    var key = norm(b.dept) + '|' + norm(b.name);
    var values = sh.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][5]) === key) return jsonOut({ error: 'dup' });
    }
    var codes = b.codes.slice(0, MAX);
    sh.appendRow([new Date(), b.org, b.bu || '', b.dept, b.name, key, codes.length].concat(pad(codes, MAX)));
    return jsonOut({ ok: true, counts: tally(), total: countBallots() });
  } catch (err) {
    return jsonOut({ error: String(err) });
  } finally { lock.releaseLock(); }
}

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(['시각','기관','부/국','과·센터','이름','중복판별키','선택수','선택1','선택2','선택3','선택4','선택5']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function tally() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  var c = {};
  if (!sh) return c;
  var v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++)
    for (var j = 7; j < 12; j++) {
      var code = String(v[i][j] || '').trim();
      if (code) c[code] = (c[code] || 0) + 1;
    }
  return c;
}
function countBallots() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  return sh ? Math.max(0, sh.getLastRow() - 1) : 0;
}

/** 득표 순위표 생성 — 전체 56편을 0표까지 포함해 정렬 */
function 집계표_만들기() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var t = ss.getSheetByName('tally') || ss.insertSheet('tally');
  t.clear();
  var total = countBallots();
  t.appendRow(['순위','코드','기관','부서','저자','득표수','득표율(%)']);
  var c = tally();
  var rows = Object.keys(META).map(function (k) {
    var n = c[k] || 0;
    return [k, META[k].o, META[k].d, META[k].a, n, total ? Math.round(n / total * 1000) / 10 : 0];
  }).sort(function (a, b) { return b[4] - a[4]; });
  rows.forEach(function (r, i) { t.appendRow([i + 1].concat(r)); });
  t.setFrozenRows(1);
  t.autoResizeColumns(1, 7);
  SpreadsheetApp.getUi().alert('집계 완료\n\n참여 ' + total + '명 · 총 ' + (total * MAX) + '표\n순위표는 tally 시트를 확인하세요.');
}

/** 참여 현황 요약 */
function 참여현황() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  var total = countBallots();
  var byOrg = {};
  if (sh) {
    var v = sh.getDataRange().getValues();
    for (var i = 1; i < v.length; i++) { var o = v[i][1] || '(미기재)'; byOrg[o] = (byOrg[o] || 0) + 1; }
  }
  var msg = '총 참여 ' + total + '명\n\n';
  Object.keys(byOrg).forEach(function (k) { msg += k + ' : ' + byOrg[k] + '명\n'; });
  SpreadsheetApp.getUi().alert(msg);
}

function pad(a, n) { var r = a.slice(); while (r.length < n) r.push(''); return r; }
function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, '').toLowerCase(); }
function jsonOut(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
