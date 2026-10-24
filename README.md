# 고유진 포트폴리오

사이트 주소: **https://egnightowl.github.io/portfolio/**

코드를 몰라도 고칠 수 있게 정리해 두었어요. 글과 작품 이미지는 모두 `content/` 폴더에 있어요.
무엇을 고치든 **저장(커밋)하면 2~3분 뒤 사이트에 자동으로 반영돼요.**

---

## 1. 어디를 고치면 되나요?

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 첫 화면 큰 제목, 이름, 키워드, 메뉴 이름, 저작권 문구 | `content/site.yml` |
| 자기소개서 (국문 / 영문) | `content/about.yml` |
| 경력, 프로젝트, 역량 칩, 졸업작품 | `content/career.yml` |
| 연락처 | `content/contact.yml` |
| 포트폴리오 유형과 과정 목록 | `content/portfolio.yml` |
| 포트폴리오 이미지 | `content/works/<유형>/<과정>/` 폴더 |
| 아트워크 목록 (Art Works) | `content/artworks.yml` (썸네일은 `content/artworks/`) |
| 작품 「오해의 오해」 대본 | `content/artworks/yesunderstand.yml` |

### 글 꾸미기
- `**굵게**` → **굵게** (경력 맨 위 문장에서는 강조색으로 보여요)
- `==강조색==` → 사이트의 강조색 글자 (예: 첫 화면 "교육 콘텐츠 디자이너")
- 줄을 바꾸면 사이트에서도 줄이 바뀌어요. 빈 줄을 하나 두면 문단이 나뉘어요.

---

## 2. 방법 A — 편집 화면(Pages CMS)에서 고치기 (추천)

블로그 글쓰기처럼 입력칸에서 고칠 수 있어요.

**처음 한 번만:**
1. https://app.pagescms.org 에 들어가서 **Sign in with GitHub**로 로그인 (egnightowl 계정)
2. 저장소 목록에 `portfolio`가 안 보이면 **Install / Add repository**를 눌러 `egnightowl/portfolio`에 접근을 허락해요
3. `portfolio` → `main`을 고르면 왼쪽에 **첫 화면 · 메뉴 / 자기소개서 / 경력 / 포트폴리오 / 연락처** 메뉴가 보여요

**고칠 때:**
- 메뉴를 골라 내용을 고치고 오른쪽 위 **Save**를 누르면 끝이에요.
- 항목을 늘리려면 목록 아래 **Add an entry**, 순서는 끌어서 바꿔요.

> 편집 화면에서 저장하면 파일 안의 `#`으로 시작하는 설명 줄은 지워질 수 있어요. 내용에는 영향이 없어요.

## 3. 방법 B — GitHub 웹사이트에서 바로 고치기

1. https://github.com/egnightowl/portfolio 에서 `content` 폴더 → 고칠 파일을 눌러요
2. 오른쪽 위 연필 아이콘(✏️ Edit)을 눌러 고쳐요
3. **Commit changes…** 를 누르고 한 번 더 **Commit changes**

주의할 점 (`.yml` 파일 규칙):
- 줄 앞 **띄어쓰기 칸 수**가 의미가 있어요. 위아래 줄과 같은 칸에 맞춰 주세요. (Tab 키 말고 스페이스)
- `|-` 다음 줄부터는 여러 줄 글이에요. 그 아래 줄들도 같은 칸 수로 들여 써요.
- 글이 `"`로 감싸져 있으면 그대로 두고 안쪽만 고치세요.

---

## 4. 포트폴리오 작품 추가 · 변경

작품 이미지는 `content/works/` 아래에 **유형 폴더 / 과정 폴더**로 나뉘어 있어요.

```
content/works/
  lecture/          교안형
  chroma/           크로마형
  studio-practice/  스튜디오 실습형
  studio/           스튜디오형
  hands-on/         실습형
  media-wall/       미디어월
  animation/        애니메이션형
    course-01/  01.png 02.png 03.png ...
```

- **과정 폴더에 이미지를 넣기만 하면** 페이지 수·썸네일·슬라이드가 자동으로 바뀌어요. 이름순(01, 02, … 10)으로 보여요.
- 첫 번째 이미지(01)가 썸네일이 돼요.
- 파일 이름은 **영어·숫자**로 해 주세요 (예: `01.png`). 한글 이름은 맥/윈도우 차이로 깨질 수 있어요.
- 이미지 형식: png, jpg, webp, gif

### 새 과정 추가
1. 이미지 올리기
   - Pages CMS: 왼쪽 **Media** → 유형 폴더로 들어가 새 폴더(예: `course-05`) 만들기 → 이미지 업로드
   - GitHub 웹: 내 컴퓨터에서 `course-05` 폴더를 만들어 이미지를 넣고 → `content/works/lecture` 에서 **Add file → Upload files** → **폴더째로** 끌어 놓기
2. `content/portfolio.yml`(또는 편집 화면 **포트폴리오**)의 해당 유형 `courses`에 추가:
   ```yaml
         - title: 과정 제목
           folder: lecture/course-05
   ```

### 이미지 바꾸기 / 빼기
같은 이름으로 다시 올리면 바뀌고, 지우면 빠져요. 폴더에 이미지가 하나도 없는 과정은 자동으로 숨겨져요.

### 새 유형 추가
`content/works/` 에 영문 폴더(예: `vr`)를 만들고, `portfolio.yml`의 `types`에 유형 하나를 추가하면 돼요.

---

## 5. 아트워크 (Art Works)

### 목록에 작품 추가
`content/artworks.yml`(또는 편집 화면 **아트워크**)의 `works`에 한 칸을 더 써요.
- `link`: 사이트 안 작품이면 `artworks/폴더이름/`, 다른 사이트면 `https://...` 주소
- `thumbnail`: `content/artworks/` 폴더에 올린 이미지 이름 (16:10 비율이 예뻐요)

### 「오해의 오해」 대본 고치기 — `content/artworks/yesunderstand.yml`
작품 주소: https://egnightowl.github.io/portfolio/artworks/yesunderstand/
대본은 GitHub 웹에서 고쳐 주세요 (편집 화면에는 없어요).

| 쓰는 법 | 뜻 |
|---|---|
| `- say:` 아래 줄들 | 친구가 보내는 말풍선. 한 줄 = 말풍선 하나, `- pause` = 잠깐 멈춤 |
| `- reply: [안녕!]` | 관객이 고를 답장을 직접 적기 |
| `- reply: { pool: 공감, count: 3 }` | 「공감」 꾸러미에서 무작위 3개 |
| `- reply: { pool: 전체, count: 3 }` | 모든 꾸러미에서 무작위 3개 |
| `- reply: { pool: [농담, 딴소리], count: 2 }` | 여러 꾸러미를 섞어서 |
| `- reply: [{ text: 그 얘기 더 해줘, go: humor }, 그만하자]` | 갈림길: 고르면 `humor` 이야기로 이동 |

- **답장 문구 늘리기**: `reply_pools:` 아래 꾸러미에 `- 문구`를 계속 추가하면 돼요. 새 꾸러미도 이름만 붙이면 바로 쓸 수 있어요. 한 번 대화하는 동안 같은 문구는 다시 안 나와요.
- **새 이야기**: `stories:` 아래에 `이름:` → `label:` → `steps:` 순서로 쓰고, `choices`나 `go:`로 연결해요.
- 무엇을 골라도 친구는 자기 이야기를 이어 가요. 그래서 답장이 무작위로 나와도 대화는 그대로 흘러가요.

### 새 인터랙티브 작품 페이지 만들기 (개발용)
`artworks/<이름>/index.html` + `src/artworks/<이름>/` 를 만들고, `vite.config.ts`의 `input`에 한 줄을 추가해요.

## 6. 반영이 됐는지 확인하기

- 저장소의 **Actions** 탭에서 맨 위 작업이 초록 체크 ✅ 이면 반영 완료예요 (2~3분).
- 빨간 ❌ 이면 보통 `.yml` 띄어쓰기가 어긋난 거예요. 방금 고친 부분의 칸 수를 확인하거나, 커밋 기록(History)에서 이전 버전으로 되돌리면 돼요. 이때 사이트는 마지막으로 성공한 상태로 그대로 있어요.
- 브라우저에 옛날 화면이 보이면 새로고침(⌘+Shift+R) 해 보세요.

---

## 참고 (개발용)

- React + TypeScript + Vite. 내용 읽기: `src/content.ts`, 화면: `src/App.tsx`, 디자인: `styles/global.css`
- 내 컴퓨터에서 미리보기: Node.js 22 설치 후 `npm install` → `npm run dev`
- 배포: `.github/workflows/deploy.yml` (main에 push → GitHub Pages)
- 편집 화면 설정: `.pages.yml`
- 원래 cargo 버전: yesunderstand.cargo.site (2020). 이전 메신저 시도: [egnightowl/yes-understand](https://github.com/egnightowl/yes-understand)
- 처음 디자인·개발: [gain-0525/Yujin-Portfolio](https://github.com/gain-0525/Yujin-Portfolio) — 커밋 기록 그대로 이어 받았어요.
