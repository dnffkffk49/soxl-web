// Cloudflare Pages Function — GET /api/price
// SOXL 최근 종가를 서버 쪽에서 야후 파이낸스로 조회해 돌려줍니다.
// 브라우저에서 직접 야후 API를 호출하면 CORS(보안 정책)에 막혀 실패하기 때문에,
// 이 함수가 대신 호출해서 그 결과만 우리 사이트 안에서 넘겨주는 중계 역할을 합니다.

export async function onRequestGet() {
  var upstream = 'https://query1.finance.yahoo.com/v8/finance/chart/SOXL?range=1mo&interval=1d';

  try {
    var res = await fetch(upstream, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; soxl-ledger/1.0)' }
    });

    if (!res.ok) {
      return json({ error: 'upstream_status_' + res.status }, 502);
    }

    var data = await res.json();
    var result = data && data.chart && data.chart.result && data.chart.result[0];
    if (!result) return json({ error: 'no_data' }, 502);

    var ts = result.timestamp || [];
    var q = result.indicators && result.indicators.quote && result.indicators.quote[0];
    var closes = (q && q.close) || [];

    var prices = [];
    for (var i = 0; i < ts.length; i++) {
      var c = closes[i];
      if (c === null || c === undefined) continue;
      // 일봉 타임스탬프는 미국 장 시작(오전 9:30 동부시간) 기준이라
      // UTC로 변환해도 날짜가 밀리지 않습니다.
      var d = new Date(ts[i] * 1000).toISOString().slice(0, 10);
      prices.push({ d: d, c: Math.round(c * 100) / 100 });
    }

    return json({ prices: prices, fetchedAt: new Date().toISOString() }, 200, 900);
  } catch (e) {
    return json({ error: String(e && e.message || e) }, 500);
  }
}

function json(obj, status, cacheSeconds) {
  var headers = { 'content-type': 'application/json; charset=utf-8' };
  if (cacheSeconds) headers['cache-control'] = 'public, max-age=' + cacheSeconds;
  return new Response(JSON.stringify(obj), { status: status || 200, headers: headers });
}
