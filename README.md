# AI Fortune (AF)

> AI 기반 사주/만세력 운세 분석 모바일 애플리케이션

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](./LICENSE)

</div>

---

## 📱 프로젝트 소개

사용자의 생년월일시 정보를 입력받아 천문학적 계산 엔진으로 사주/작명 데이터를 로컬에서 계산하고, AI를 통해 운세를 분석해주는 크로스 플랫폼 모바일 애플리케이션입니다.

### ✨ 주요 기능

- 🎯 **프로필 관리**: 여러 사람의 프로필 저장 및 관리
- 📝 **템플릿 기반 분석**: 신년운세, 오늘의 운세 등 다양한 템플릿
- 🌙 **로컬 천문 계산**: 사주/만세력 데이터를 기기에서 직접 계산
- 🤖 **{{AppName}}**: 계산된 데이터를 AI로 분석하여 운세 제공
- 🌓 **다크모드 지원**: 시스템 테마에 따른 자동 전환
- 📊 **오픈소스 고지**: 투명한 라이센스 정보 제공

---

## 🛠 기술 스택

### Core
- **Framework**: Expo SDK 54 + React Native 0.81
- **Router**: Expo Router 6 (파일 기반 라우팅)
- **Language**: TypeScript 5.9
- **Package Manager**: pnpm

### UI/UX
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Icons**: @expo/vector-icons (Ionicons)
- **Safe Area**: react-native-safe-area-context
- **Animation**: react-native-reanimated, Lottie

### State Management
- **Global State**: Zustand 5
- **Server State**: TanStack Query v5
- **Local Storage**: @react-native-async-storage/async-storage

### Astrology Engine
- **Saju/Jami**: @orrery/core 0.3.0 ⚠️ AGPL-3.0
- **Lunar Calendar**: lunar-javascript
- **Timezone**: Intl API (패치 적용)

### Additional
- **Ads**: react-native-google-mobile-ads
- **Markdown**: react-native-markdown-display
- **Clipboard**: expo-clipboard
- **Device Info**: expo-device, expo-application

---

## 🚀 설치 및 실행

### 사전 요구사항

- Node.js 18 이상
- pnpm (권장 패키지 매니저)
- iOS: Xcode 15+ 및 CocoaPods
- Android: Android Studio 및 Android SDK 33+

### 설치

```bash
# 저장소 클론
git clone https://github.com/macjjuni/af-frontend.git
cd af-frontend

# 의존성 설치
pnpm install

# iOS 네이티브 의존성 설치 (Mac만)
cd ios && pod install && cd ..
```

### 실행

```bash
# 개발 서버 시작 (캐시 클리어)
pnpm start

# Android 에뮬레이터/기기
pnpm android

# iOS 시뮬레이터 (Mac만)
pnpm ios

# 웹 브라우저 (테스트용)
pnpm web
```

### 빌드

```bash
# iOS 프로덕션 빌드 (EAS)
pnpm build:ios

# Android 프로덕션 빌드 (EAS)
pnpm build:android

# 네이티브 프로젝트 재생성
pnpm prebuild
```

---

## 📂 프로젝트 구조

```
af-frontend/
├── app/                          # Expo Router 라우트
│   ├── (tabs)/                  # 탭 네비게이션
│   │   ├── index.tsx           # 홈 (템플릿 목록)
│   │   ├── profiles.tsx        # 프로필 관리
│   │   └── settings.tsx        # 설정
│   ├── legal/                   # 약관 및 안내
│   │   ├── index.tsx           # 약관 목록 (2뎁스)
│   │   ├── terms.tsx           # 이용약관
│   │   ├── privacy.tsx         # 개인정보처리방침
│   │   └── ai-notice.tsx       # AI 서비스 안내
│   ├── profiles/                # 프로필 상세
│   │   ├── new.tsx             # 프로필 생성
│   │   └── [id].tsx            # 프로필 편집
│   ├── template/
│   │   └── [id].tsx            # 템플릿 상세 & 프로필 선택
│   ├── fortune.tsx              # 운세 분석 화면
│   ├── result.tsx               # 만세력 결과
│   ├── onboarding/              # 온보딩
│   ├── _layout.tsx              # 루트 레이아웃
│   └── +not-found.tsx           # 404
├── components/                   # 재사용 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트
│   ├── settings/                # 설정 공통 컴포넌트
│   └── [...]
├── store/                        # Zustand 스토어
│   ├── useAppStore.ts           # 앱 전역 상태
│   └── useProfileStore.ts       # 프로필 관리
├── hooks/                        # 커스텀 훅
├── providers/                    # Context Providers
├── constants/                    # 상수 (자동 생성 포함)
├── scripts/                      # 빌드 스크립트
│   ├── generate-privacy-policy.js
│   ├── generate-terms.js
│   ├── generate-ai-notice.js
│   └── generate-licenses-md.js
├── patches/                      # pnpm 패치 파일
│   └── @orrery__core@0.3.0.patch  # iOS 성능 패치
├── assets/                       # 정적 파일
├── CLAUDE.md                     # Claude Code 가이드
├── LICENSES.md                   # 오픈소스 라이센스 (자동 생성)
└── tailwind.config.js
```

---

## 💻 개발 가이드라인

### 코드 작성 규칙

모든 컴포넌트와 훅은 **반드시** 다음 순서로 region을 구성합니다:

```typescript
export default function Component() {
  // region [hooks]
  // React hooks (useState, useQuery, useRouter 등)
  // endregion

  // region [Privates]
  // 내부 헬퍼 함수, 포매팅, orrery 로직
  // ⚠️ Events보다 먼저 선언해야 함
  // endregion

  // region [Events]
  // 이벤트 핸들러 (onPress, onChangeText 등)
  // endregion

  // region [Transactions]
  // API 호출 함수 (TanStack Query / Fetch)
  // endregion

  // region [Life Cycles]
  // useEffect 및 라이프사이클 관련 로직
  // endregion

  return (/* JSX */);
}
```

### 핵심 로직

#### 1. Device ID 관리
```typescript
// 앱 시작 시 고유 ID 생성 및 저장
const deviceID = await initDeviceId();

// 모든 API 요청에 포함 (Rate Limiting)
POST /api/v1/fortune
Body: { deviceID, ...fortuneData }
```

#### 2. 운세 분석 플로우
1. **프로필 선택** → 저장된 프로필 또는 신규 입력
2. **로컬 계산** → `@orrery/core`로 사주/작명 데이터 계산
3. **API 요청** → 계산 결과 + deviceID를 백엔드 전송
4. **결과 표시** → AI 분석 결과 렌더링

#### 3. 새 화면 추가 시
```typescript
// 1. 파일 생성: app/example/index.tsx
// 2. _layout.tsx에 등록:
const SCREEN_CONFIGS = [
  // ...
  { name: 'example/index', options: { headerShown: false } },
];
// 3. 커스텀 헤더 사용: <ScreenHeader title="..." />
```

### Path Alias

`@/`는 프로젝트 루트를 의미합니다:

```typescript
import { Button } from '@/components';
import useAppStore from '@/store/useAppStore';
```

---

## 📜 라이센스

본 프로젝트는 **GNU Affero General Public License v3.0 (AGPL-3.0)** 라이센스를 따릅니다.

### ⚠️ AGPL-3.0 적용 이유

본 프로젝트는 사주/만세력 계산을 위해 [`@orrery/core`](https://github.com/lunatquantum/orrery) 라이브러리(AGPL-3.0)를 사용합니다. AGPL-3.0은 강력한 copyleft 라이센스로, 네트워크를 통한 사용도 "배포"로 간주하여 소스 코드 공개를 요구합니다.

### 주요 의무사항

1. **소스 코드 공개**: 수정 또는 파생 작업물의 전체 소스 코드 공개
2. **네트워크 서비스 = 배포**: 서비스로 제공 시에도 소스 공개 의무
3. **라이센스 고지 유지**: 저작권 및 라이센스 고지 포함
4. **수정 사항 명시**: 수정 일자 및 내용 명시

### 오픈소스 라이센스 정보

본 프로젝트는 676개의 오픈소스 라이브러리를 사용합니다:

- **전체 라이센스 목록**: [LICENSES.md](./LICENSES.md)
- **주요 라이브러리**:
  - `@orrery/core` (AGPL-3.0) - 사주/만세력 계산 엔진
  - `react`, `react-native`, `expo` (MIT)
  - `zustand`, `@tanstack/react-query` (MIT)
  - `lottie-react-native` (Apache-2.0)

자세한 내용은 [라이센스 전문](./LICENSE) 또는 [LICENSES.md](./LICENSES.md)를 참조하세요.

---

## 🤝 기여

본 프로젝트에 기여하는 경우, 귀하의 기여물은 AGPL-3.0 라이센스 조건에 따라 배포됩니다.

### 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 문의

- **이메일**: macjjuni@gmail.com
- **이슈**: [GitHub Issues](https://github.com/macjjuni/af-frontend/issues)

---

## 📝 면책 조항

본 소프트웨어는 "있는 그대로" 제공되며, 명시적이든 묵시적이든 어떠한 보증도 제공하지 않습니다.

운세 분석 결과는 참고용이며, 실제 생활의 의사결정에 절대적인 기준으로 사용되어서는 안 됩니다.

---

<div align="center">

Made with ❤️ by [macjjuni](https://github.com/macjjuni)

</div>
