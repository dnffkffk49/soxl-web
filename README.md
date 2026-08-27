# SOXL 매매장부 — 배포 가이드 (GitHub Pages)

## 폴더 구성
- `index.html` — 실제 배포할 앱 (종가 자동 갱신 기능 포함)
- `prices.json` — SOXL 최근 종가 데이터. GitHub Actions가 매일 자동으로 갱신해서 커밋합니다
- `.github/workflows/update-price.yml` — 평일마다 자동으로 종가를 받아오는 스케줄
- `scripts/fetch-price.mjs` — 실제로 야후 파이낸스에서 종가를 받아오는 스크립트 (서버 쪽에서 실행되므로 CORS 문제 없음)
- `soxl-blank.html` — 원본 파일. 손대지 않고 그대로 보관 중

## 왜 public 저장소로 올려도 괜찮은가

이 앱은 매매 기록(매수·매도·수익금 등)을 GitHub이나 다른 서버로 전송하지 않습니다. 입력한 내용은 **오직 그 브라우저의 로컬 저장소**에만 남고, 저장소에는 빈 껍데기 앱 코드만 올라갑니다. 그래서 저장소를 public으로 해도 개인 매매 기록이 노출되지 않습니다. (`index.html` 안의 초기 데이터가 항상 비어있는지는 커밋 전에 한 번씩 확인해주세요 — 아래 "확인" 항목 참고)

---

## 1단계 — GitHub 저장소 만들기

1. github.com 로그인 → 우측 상단 `+` → **New repository**
2. Repository name: 예) `soxl-ledger`
3. **Public** 선택 (Pages 무료로 쓰려면 public이어야 합니다)
4. **Create repository** (README 등 다른 파일은 추가하지 않기)

## 2단계 — 코드 올리기

터미널(PowerShell)에서:

```bash
cd "D:\soxl web page"
git remote add origin https://github.com/<본인아이디>/soxl-ledger.git
git branch -M main
git push -u origin main
```

처음 push할 때 브라우저로 GitHub 로그인 창이 뜨면 본인 계정으로 로그인하면 됩니다.

## 3단계 — GitHub Pages 켜기

1. 저장소 페이지 → **Settings** → 왼쪽 메뉴 **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / 폴더: `/ (root)` 선택 → **Save**
4. 잠시 후 `https://<본인아이디>.github.io/soxl-ledger/` 주소가 생깁니다

## 4단계 — 자동 종가 갱신이 도는지 확인

1. 저장소 페이지 → **Actions** 탭 → "SOXL 종가 자동 갱신" 워크플로가 보이는지 확인
2. 바로 확인해보고 싶으면 워크플로 클릭 → **Run workflow**로 수동 실행 가능
3. 평일에는 매일 자동으로 실행됩니다 (미국 장 마감 30분~1시간 뒤, 한국 시간 새벽)
4. 실행되면 `prices.json` 파일이 자동으로 갱신되고 커밋됩니다

---

## 확인 방법

- 3단계 주소로 접속 → "시세" 탭 확인
- 최근 며칠치 종가가 흐린 글씨로 자동으로 채워져 있으면 정상 (Actions가 아직 한 번도 안 돌았다면 비어있을 수 있으니 4단계에서 수동 실행 먼저 해보세요)
- 값을 손으로 고쳐보면 진하게 바뀌고, 그 뒤로는 자동 갱신에서 빠지는지 확인
- **커밋하기 전에** `index.html`을 열어 `<script id="state"...>` 안의 `"trades":[]` 부분이 실제로 비어있는지 한 번 확인해주세요. 여기에 실제 매매 기록이 들어있는 상태로 push하면 그 내용이 public 저장소에 그대로 올라갑니다.

## 알아두어야 할 점

- 매매 기록(매수·매도·차수 등)은 여전히 **이 브라우저의 로컬 저장소**에만 남습니다. 기기를 바꾸거나(PC↔폰) 브라우저 데이터를 지우면 그 기기의 기록은 사라질 수 있어요. 다만 `file://`로 직접 열던 예전 방식보다는 훨씬 안정적입니다(정식 https 주소라 브라우저가 지우지 않는 한 유지됩니다).
- 종가만 자동으로 갱신되고, 매매 기록 입력은 여전히 손으로 해야 합니다.
- 종가는 실시간이 아니라 **하루 한 번(장 마감 후)** 갱신됩니다. 이 앱 자체가 "그날 종가" 기준으로 설계되어 있어서 실시간 갱신은 원래 필요하지 않습니다.

## 코드를 다시 고치고 싶을 때

```bash
git add -A
git commit -m "설명"
git push
```

push하면 GitHub Pages가 자동으로 다시 배포합니다.
