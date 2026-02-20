# AI Fortune

AI 기반 사주/만세력 운세 분석 모바일 애플리케이션

> ⚠️ **라이센스 공지**: 본 프로젝트는 AGPL-3.0 라이센스 라이브러리인 `@orrery/core`를 사용합니다. 따라서 본 프로젝트 전체가 AGPL-3.0 라이센스의 적용을 받습니다.

## 프로젝트 소개

사용자의 생년월일시 정보를 입력받아 천문학적 계산 엔진(orrery)으로 사주/작명 데이터를 로컬에서 계산하고, AI를 통해 운세를 분석해주는 크로스 플랫폼 모바일 애플리케이션입니다.

## 기술 스택

### Core
- **Framework**: Expo SDK 54 + React Native 0.81
- **Router**: Expo Router 6 (파일 기반 라우팅)
- **Language**: TypeScript 5.9

### Styling & UI
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Safe Area**: react-native-safe-area-context

### State Management & Data Fetching
- **Global State**: Zustand 5
- **Server State**: TanStack Query v5
- **Device ID**: expo-device, expo-application

### Astrology Engine
- **Saju/Jami Calculation**: @orrery/core 0.3.0 (로컬 천문 계산) - **AGPL-3.0 License**
- **Lunar Calendar**: lunar-javascript

### Additional Features
- **Ads**: react-native-google-mobile-ads
- **Markdown Rendering**: react-native-markdown-display
- **Animation**: react-native-reanimated

## 주요 기능

- 생년월일시 및 출생지 입력
- 로컬 천문학 엔진을 통한 사주/만세력 계산
- AI 기반 운세 분석
- 다크모드 지원
- 개인정보처리방침 제공

## 설치 및 실행

### 사전 요구사항

- Node.js 18 이상
- pnpm (패키지 매니저)
- iOS: Xcode 및 CocoaPods
- Android: Android Studio 및 Android SDK

### 설치

```bash
# 의존성 설치
pnpm install

# iOS 네이티브 의존성 설치
cd ios && pod install && cd ..
```

### 실행

```bash
# Expo 개발 서버 시작 (캐시 클리어)
pnpm start

# Android 에뮬레이터
pnpm android

# iOS 시뮬레이터
pnpm ios

# 웹 브라우저
pnpm web

# NativeWind 업데이트 후 권장 (캐시 클리어 후 시작)
pnpm start -c
```

### Prebuild

```bash
# 전체 네이티브 프로젝트 재생성
pnpm prebuild

# iOS만 재생성
pnpm prebuild:ios

# Android만 재생성
pnpm prebuild:android
```

## 프로젝트 구조

```
af-frontend/
├── app/                      # Expo Router 기반 라우트
│   ├── index.tsx            # 생년월일 입력 화면
│   ├── result.tsx           # 만세력 결과 화면
│   ├── fortune.tsx          # 운세 분석 화면
│   ├── privacy.tsx          # 개인정보처리방침
│   ├── _layout.tsx          # 레이아웃 설정
│   └── +not-found.tsx       # 404 페이지
├── components/              # 재사용 가능한 컴포넌트
├── store/                   # Zustand 스토어
│   └── useAppStore.ts       # 앱 전역 상태 (birthForm, deviceID 등)
├── hooks/                   # 커스텀 훅
├── scripts/                 # 빌드/배포 스크립트
├── assets/                  # 이미지, 폰트 등 정적 파일
├── patches/                 # 패키지 패치 파일
├── CLAUDE.md               # Claude Code 가이드라인
└── tailwind.config.js      # Tailwind CSS 설정
```

## 개발 가이드라인

### 코드 작성 규칙 (React)

모든 컴포넌트와 훅은 **반드시** 다음 순서로 region을 구성합니다:

```typescript
// region [hooks]
// React hooks (useState, useQuery, useRouter 등)
// endregion

// region [Privates]
// 내부 헬퍼 함수, 포매팅, orrery 로직
// Events보다 먼저 선언해야 함
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
```

### 핵심 로직 구현

#### 1. Device ID 관리
- 앱 실행 시 Zustand 스토어에 고유 `deviceID` 초기화
- 모든 백엔드 요청에 `deviceID` 포함 (Rate Limiting용)

#### 2. 운세 분석 플로우
1. **Step 1**: UI에서 사용자 생년월일시 정보 수집
2. **Step 2**: `orrery` 엔진으로 로컬에서 사주/작명 데이터 계산
3. **Step 3**: 계산된 데이터 + `deviceID`를 Go 백엔드로 전송 (`POST /api/v1/fortune`)
4. **Step 4**: 로딩 상태 표시 후 최종 분석 결과 렌더링

### Path Alias

`@/`는 프로젝트 루트를 의미합니다:

```typescript
import { SelectPicker } from '@/components';
import useAppStore from '@/store/useAppStore';
```

## 라이센스

본 프로젝트는 **GNU Affero General Public License v3.0 (AGPL-3.0)** 라이센스를 따릅니다.

### AGPL-3.0 라이센스 적용 이유

본 프로젝트는 사주/만세력 계산을 위해 [`@orrery/core`](https://github.com/lunatquantum/orrery) 라이브러리(AGPL-3.0)를 사용합니다. AGPL-3.0은 강력한 copyleft 라이센스로, 이를 사용하는 모든 파생 작업물은 동일한 라이센스를 적용받습니다.

### 주요 의무사항

본 프로젝트를 사용, 수정, 배포하는 경우 다음 사항을 준수해야 합니다:

1. **소스 코드 공개 의무**
   - 본 소프트웨어를 수정하거나 파생 작업물을 만드는 경우, 전체 소스 코드를 AGPL-3.0 라이센스로 공개해야 합니다.

2. **네트워크 사용 = 배포**
   - 일반 GPL과 달리, AGPL-3.0은 네트워크를 통해 소프트웨어를 서비스로 제공하는 것도 "배포"로 간주합니다.
   - 본 앱을 백엔드 서비스와 함께 운영하는 경우, 사용자가 소스 코드에 접근할 수 있도록 해야 합니다.

3. **라이센스 및 저작권 고지 유지**
   - 모든 배포본에 원저작자의 저작권 고지 및 AGPL-3.0 라이센스 전문을 포함해야 합니다.

4. **수정 사항 명시**
   - 원본 코드를 수정한 경우, 수정 일자와 내용을 명시해야 합니다.

### 라이센스 전문

전체 라이센스 내용은 [LICENSE](./LICENSE) 파일 또는 [GNU AGPL-3.0 공식 페이지](https://www.gnu.org/licenses/agpl-3.0.html)에서 확인할 수 있습니다.

### 사용 라이브러리 라이센스

| 라이브러리 | 버전 | 라이센스 |
|-----------|------|---------|
| @orrery/core | 0.3.0 | AGPL-3.0 |
| lunar-javascript | 1.7.7 | MIT |
| expo | ~54.0 | MIT |
| react-native | 0.81.5 | MIT |
| zustand | 5.0.11 | MIT |
| @tanstack/react-query | 5.90.21 | MIT |
| nativewind | 4.2.1 | MIT |

## 기여

본 프로젝트에 기여하는 경우, 귀하의 기여물은 AGPL-3.0 라이센스 조건에 따라 배포됩니다.


## 면책 조항

본 소프트웨어는 "있는 그대로" 제공되며, 명시적이든 묵시적이든 어떠한 보증도 제공하지 않습니다. 자세한 내용은 AGPL-3.0 라이센스 전문을 참조하세요.
