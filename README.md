# Pokency

> **2025 Web Programming Project**  
> Pokémon + Agency — AI와 함께하는 포켓몬 배틀 시뮬레이터  

사용자가 포켓몬을 선택하면 **OpenAI** 기반 AI가 실제 상성·기술을 고려해 전략적으로 전투를 진행합니다. 프런트엔드-서버리스 백엔드 구조로 빠른 배포와 확장성을 확보했습니다.

---

## 🖼️ System Architecture

![image](https://github.com/user-attachments/assets/7bdbca62-bf42-44dd-b09f-b05168957b45) 

```
Client ──▶ Nginx (Proxy) ──▶ React (Vite build)
│
└──▶ /api/** ──▶ Amazon API Gateway ──▶ AWS Lambda
└──▶ PokéAPI · OpenAI
```

* **Serverless**: SAM + API Gateway + Lambda (`pokemon`, `startBattle`, `turnBattle` …)  
* **CI/CD**: GitHub Actions → 자동 빌드 & 배포  
* **AI 엔진**: OpenAI가 전투 상황·기술 목록을 받아 최적 스킬 선택

---

## 💻 Tech Stack

| Field          | Technology of use |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**   | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"> <img src="https://img.shields.io/badge/tailwind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"> |
| **Backend**    | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white"> <img src="https://img.shields.io/badge/Amazon%20API%20Gateway-FF4F8B?style=for-the-badge&logo=amazonaws&logoColor=white"> |
| **DevOps**     | <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=black"> <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white"> |
| **AI**         | <img src="https://img.shields.io/badge/OpenAI-74aa9c?style=for-the-badge&logo=openai&logoColor=white"> |
| **API**        | <img src="https://img.shields.io/badge/PokéAPI-FDCA01?style=for-the-badge&logo=pokemon&logoColor=black"> |
| **Etc**        | <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"> |

---

## 🧩 주요 기능

| 기능 | 설명 |
| ---- | ---- |
| **포켓몬 선택 & 상세 조회** | 1000+ 포켓몬 검색 · 스탯 · 타입 · 기술 확인 (PokéAPI) |
| **AI 배틀 시뮬레이션** | 현재 턴 상황과 사용 가능 기술을 OpenAI에게 전달 → AI가 최적 기술 선택 |
| **Local History** | 최근 전투 기록을 LocalStorage에 저장해 재방문 시 즉시 재현 |
| **Timeout 재시도** | API Gateway 지연 시 최대 3회 자동 재시도 → UX 유지 |

---

## 📂 Directory Structure

```
/
├── docker-compose.yaml          # Nginx 실행
├── proxy/                       # Nginx 리버스 프록시 컨테이너
│   ├── Dockerfile
│   └── nginx.conf
│
├── pokency-frontend/            # React + Vite + Tailwind
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/                 # API 호출 래퍼
│       │   ├── battle.js
│       │   ├── client.js
│       │   └── pokemon.js
│       ├── components/
│       │   ├── Battle/          # 전투 UI 모듈 (BattleLog, HpBar, …)
│       │   ├── PokemonCard.jsx
│       │   └── *Tab.jsx         # 상세 탭들
│       ├── pages/               # 라우트 단위 페이지
│       │   ├── HomePage.jsx
│       │   ├── SelectPokemonPage.jsx
│       │   └── BattlePage.jsx
│       ├── store/               # Zustand 상태 관리
│       │   └── pokemonStore.js
│       └── main.jsx
│
├── pokency-serverless/          # AWS SAM (Serverless Backend)
│   ├── template.yaml            # SAM 템플릿 (API Gateway + Lambda)
│   ├── samconfig.toml           # 배포 설정
│   ├── events/event.json        # 로컬 테스트 이벤트
│   └── functions/
│       └── pokemon/             # 단일 Lambda 핸들러
│           ├── app.mjs          # entry: router
│           ├── service/         # 비즈니스 로직 모듈
│           │   ├── fetchPokemonList.mjs
│           │   ├── fetchSinglePokemon.mjs
│           │   ├── fetchPokemonMoves.mjs
│           │   ├── startBattle.mjs
│           │   ├── executeTurn.mjs
│           │   └── getNarration.mjs
│           ├── utils/response.mjs
│           └── tests/unit/…     # Mocha + Chai 유닛 테스트
│
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites

* **Node.js ≥ 18** & npm (or pnpm)  
* **Docker + Docker Compose** — 풀-스택 구동  
* **AWS SAM CLI** — Serverless 로컬 테스트

### 2. Front-End (Vite Dev Server)

```bash
cd pokency-frontend
npm install           # or pnpm install
npm run dev           # http://localhost:5173
```

### 3. Serverless Backend (SAM)
```bash
cd pokency-serverless
sam build             # 의존성 포함 빌드
sam local start-api   # http://localhost:3000
```

SAM CLI가 다음 8개 엔드포인트를 자동 마운트합니다.

```
GET  /pokemon
GET  /pokemon/{name}
GET  /pokemon/{name}/abilities
GET  /pokemon/{name}/moves
GET  /pokemon/{name}/evolution
GET  /battle/type-effectiveness
POST /battle/start
POST /battle/turn
```

### 4. Nginx Proxy via Docker Compose
```
docker compose up -d   # Nginx(80→8080) + React 정적 파일 + API 프록시
```

## 🔄 Serverless Details

| 리소스        | 세부 정보 |
| ------------- | -------- |
| **API Gateway** | REST API · 스테이지 **Prod** |
| **Lambda**    | `getPokemonFunction` (Node.js 22) — 전체 8개 엔드포인트 처리 |
| **CloudWatch**| 함수 로그 ‧ 지연 분석 |
| **Outputs (SAM)** | `GetPokemonApi = https://j1dysge505.execute-api.ap-northeast-2.amazonaws.com/Prod` |

### Endpoints & Internal Handlers

| Method | Endpoint | 기능 | Service 모듈 |
| ------ | -------- | ---- | ------------ |
| GET    | `/pokemon` | 포켓몬 목록 | `fetchPokemonList.mjs` |
| GET    | `/pokemon/{name}` | 단일 정보 | `fetchSinglePokemon.mjs` |
| GET    | `/pokemon/{name}/abilities` | 능력 조회 | `fetchPokemonAbilities.mjs` |
| GET    | `/pokemon/{name}/moves` | 기술 목록 | `fetchPokemonMoves.mjs` |
| GET    | `/pokemon/{name}/evolution` | 진화 트리 | `fetchEvolutionChain.mjs` |
| GET    | `/battle/type-effectiveness` | 타입 상성 분석 | `fetchTypeEffectiveness.mjs` |
| POST   | `/battle/start` | 배틀 시작 | `startBattle.mjs` |
| POST   | `/battle/turn` | 한 턴 진행 | `executeTurn.mjs` |

---

## 🚀 Deployment & CI/CD

| 단계 | 작업 |
| ---- | ---- |
| **CI** | `pokency-serverless/**` 변경 시 GitHub Actions가<br>`sam build --use-container` + Mocha/Chai 유닛 테스트 실행 |
| **CD** | `main` 브랜치 push → GitHub Actions가<br>`sam deploy --guided` 호출 → **pokency-stack**(ap-northeast-2) 업데이트 & Prod 스테이지 배포 |

배포 완료 콘솔 예시:

```
Description   GetPokemon Lambda Function ARN
Value         arn:aws:lambda:ap-northeast-2:471112758524:function:getPokemonFunction

Key           GetPokemonApi
Value         https://j1dysge505.execute-api.ap-northeast-2.amazonaws.com/Prod/pokemon/pikachu
```

## 📜 License

MIT License — © 2025 Jongmin Choi


