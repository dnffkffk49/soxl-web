// GitHub Actions에서 서버 쪽으로 실행되는 스크립트.
// 브라우저가 아니라 서버(Actions 실행기)에서 직접 호출하는 거라 CORS 문제가 없습니다.
// 야후 파이낸스에서 SOXL 최근 종가를 받아와 prices.json 파일로 저장합니다.

import { writeFileSync } from 'fs';

const YAHOO_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/SOXL?range=1mo&interval=1d';
const OUT = new URL('../prices.json', import.meta.url);

async function main() {
  const res = await fetch(YAHOO_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; soxl-ledger-bot/1.0)' }
  });
  if (!res.ok) throw new Error('upstream_status_' + res.status);

  const data = await res.json();
  const result = data && data.chart && data.chart.result && data.chart.result[0];
  if (!result) throw new Error('no_data');

  const ts = result.timestamp || [];
  const q = result.indicators && result.indicators.quote && result.indicators.quote[0];
  const closes = (q && q.close) || [];

  const prices = [];
  for (let i = 0; i < ts.length; i++) {
    const c = closes[i];
    if (c === null || c === undefined) continue;
    // 일봉 타임스탬프는 미국 장 시작(오전 9:30 동부시간) 기준이라
    // UTC로 변환해도 날짜가 밀리지 않습니다.
    const d = new Date(ts[i] * 1000).toISOString().slice(0, 10);
    prices.push({ d, c: Math.round(c * 100) / 100 });
  }

  const payload = { prices, fetchedAt: new Date().toISOString() };
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log('종가 ' + prices.length + '일치 저장 완료:', OUT.pathname);
}

main().catch((e) => {
  console.error('가격 조회 실패:', e);
  process.exit(1);
});
