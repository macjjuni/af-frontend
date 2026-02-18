# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) for the **af-frontend** repository.

## Commands

This project uses `pnpm` as the package manager.

- `pnpm start` : Start Expo dev server
- `pnpm android` : Start with Android emulator
- `pnpm ios` : Start with iOS simulator
- `pnpm web` : Start with web browser
- `pnpm start -c` : Start with cache clear (Recommended for NativeWind updates)

## Architecture & Tech Stack

- **Framework**: Expo + React Native (Expo Router)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **State Management**: Zustand (Device ID & User State)
- **Data Fetching**: TanStack Query v5
- **Astrology Engine**: orrery (Local Saju/Jami computation)
- **Device ID**: Mandatory for rate-limiting (retrieved via expo-device/application)

## Strict Coding Conventions (React)

You MUST organize all component and hook code into the following specific regions using `// region [Name]` and `// endregion` comments in this exact order:

1. `// region [hooks]`: React hooks (useState, useQuery, useNavigation, etc.)
2. `// region [Privates]`: Internal helper functions, formatting, orrery logic. **Must be declared before Events.**
3. `// region [Events]`: Event handlers (e.g., onPress, onChangeText)
4. `// region [Transactions]`: API call functions (TanStack Query / Fetch)
5. `// region [Life Cycles]`: useEffect and other lifecycle-related logic

### General Rules
- No regions for import statements.
- Use latest React/Expo functional component patterns.
- Variable and function names must be descriptive.
- Adhere to the "Simple is best" principle.

## Core Logic Implementation

### 1. Device ID Management
- Initialize a unique `deviceID` in the Zustand store on app launch.
- Include `deviceID` in all requests to the Go backend for rate-limiting (3 calls/24h).

### 2. Fortune Analysis Flow
- **Step 1**: Collect user birth info via UI.
- **Step 2**: Compute Saju/Jami data locally using the `orrery` engine.
- **Step 3**: Send computed data + `deviceID` to the Go backend (`POST /api/v1/fortune`).
- **Step 4**: Display loading state during analysis and render final result.

## Path Aliases
- `@/` maps to the project root. (e.g., `@/components`, `@/store`, `@/hooks`)