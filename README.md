# SOXL 매매장부 — 배포 가이드

## 폴더 구성
- `index.html` — 실제 배포할 앱 (종가 자동 갱신 기능 포함)
- `functions/api/price.js` — 야후 파이낸스에서 SOXL 최근 종가를 대신 조회해오는 서버 함수 (Cloudflare Pages Function)
- `soxl-blank.html` — 원본 파일. 손대지 않고 그대로 보관 중

앱 자체는 지금처럼 손으로 매매 기록을 입력하는 장부이고, **종가(주가)만** 앱을 열 때마다 자동으로 채워지도록 바뀌었습니다. 시세 탭에서 흐리게 표시된 값이 자동으로 채워진 값이고, 손으로 고치면 그 뒤로는 자동 갱신에서 제외됩니다.

---

## 1단계 — GitHub 비공개(Private) 저장소 만들기

1. github.com 로그인 → 우측 상단 `+` → **New repository**
2. Repository name: 예) `soxl-ledger`
3. **Private** 선택 ⚠️ (Public으로 하면 매매 기록이 공개될 수 있으니 꼭 Private)
4. **Create repository** 클릭 (README 등 다른 파일은 추가하지 않기)

## 2단계 — 코드 올리기

터미널(PowerShell)에서:

```bash
cd "D:\soxl web page"
git remote add origin https://github.com/<본인아이디>/soxl-ledger.git
git branch -M main
git push -u origin main
```

처음 push할 때 브라우저로 GitHub 로그인 창이 뜨면 본인 계정으로 로그인하면 됩니다.

## 3단계 — Cloudflare Pages에 연결

1. dash.cloudflare.com 가입/로그인 (무료, 신용카드 불필요)
2. 왼쪽 메뉴 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 방금 만든 `soxl-ledger` 저장소 선택
4. Build settings
   - Framework preset: **None**
   - Build command: *(비워두기)*
   - Build output directory: `/`
5. **Save and Deploy**

몇 분 뒤 `https://soxl-ledger-xxx.pages.dev` 같은 주소가 생깁니다.

## 4단계 — 본인만 볼 수 있게 잠그기 (Cloudflare Access)

1. Cloudflare 대시보드에서 **Zero Trust** 메뉴로 이동 (무료 플랜으로 시작 가능)
2. **Access** → **Applications** → **Add an application** → **Self-hosted**
3. Application domain: 3단계에서 만든 `pages.dev` 주소 입력
4. Policy 이름 예) `only-me`, Action: **Allow**
5. Include 규칙 → **Emails** → 본인 이메일 주소 입력
6. Login methods: **One-time PIN**(이메일로 인증코드 받는 방식) 추천 — 별도 가입 없이 바로 씀
7. **Save**

이제 그 주소로 들어가면 이메일 인증(원타임 코드) 후에만 앱이 열립니다. 폰이든 PC든 같은 방식으로 접속하면 됩니다.

---

## 확인 방법

- 배포된 주소로 접속 → 인증 통과 → "시세" 탭 확인
- 최근 며칠치 종가가 흐린 글씨로 자동으로 채워져 있으면 정상
- 값을 손으로 고쳐보면 진하게 바뀌고, 그 뒤로는 자동 갱신에서 빠지는지 확인

## 알아두어야 할 점

- 매매 기록(매수·매도·차수 등)은 여전히 **이 브라우저의 로컬 저장소**에만 남습니다. 기기를 바꾸거나(PC↔폰) 브라우저 데이터를 지우면 그 기기의 기록은 사라질 수 있어요. 다만 `file://`로 직접 열던 예전 방식보다는 훨씬 안정적입니다(정식 https 주소라 브라우저가 지우지 않는 한 유지됩니다).
- 종가만 자동으로 갱신되고, 매매 기록 입력은 여전히 손으로 해야 합니다.

## 코드를 다시 고치고 싶을 때

```bash
git add -A
git commit -m "설명"
git push
```

push하면 Cloudflare Pages가 자동으로 다시 배포합니다.
