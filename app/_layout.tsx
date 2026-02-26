import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import useAppStore from '@/store/useAppStore';
import useProfileStore from '@/store/useProfileStore';
import { QueryProvider } from '@/providers';
import { GlobalLoadingOverlay } from '@/components';
import '../global.css';

export { ErrorBoundary } from 'expo-router';


SplashScreen.preventAutoHideAsync();

type ScreenConfig = {
  name: string;
  options?: {
    headerShown?: boolean;
    gestureEnabled?: boolean;
  };
};

const SCREEN_CONFIGS: ScreenConfig[] = [
  { name: 'onboarding/index', options: { headerShown: false, gestureEnabled: false } },
  { name: 'onboarding/consent', options: { headerShown: false, gestureEnabled: false } },
  { name: '(tabs)', options: { headerShown: false } },
  { name: 'template/[id]', options: { headerShown: false } },
  { name: 'result', options: { headerShown: false } },
  { name: 'fortune', options: { headerShown: false } },
  { name: 'legal/index', options: { headerShown: false } },
  { name: 'legal/terms', options: { headerShown: false } },
  { name: 'legal/privacy', options: { headerShown: false } },
  { name: 'legal/ai-notice', options: { headerShown: false } },
  { name: 'profiles/new', options: { headerShown: false } },
  { name: 'profiles/[id]', options: { headerShown: false } },
  { name: '+not-found' },
];

export default function RootLayout() {
  // region [hooks]
  const initDeviceId = useAppStore((s) => s.initDeviceId);
  const initOnboarding = useAppStore((s) => s.initOnboarding);
  const loadProfiles = useProfileStore((s) => s.loadProfiles);
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    const initialize = async () => {
      try {
        // iOS 추적 권한 요청 (실패해도 계속 진행)
        if (Platform.OS === 'ios') {
          try {
            const { requestTrackingPermissionsAsync } = await import('expo-tracking-transparency');
            await requestTrackingPermissionsAsync();
          } catch (error) {
            console.warn('Failed to request tracking permissions:', error);
          }
        }

        // AdMob 초기화 (백그라운드에서 실행, 실패 시 재시도)
        if (Platform.OS !== 'web') {
          const initializeAdMobWithRetry = async (attempt = 1, maxAttempts = 5): Promise<void> => {
            try {
              const mobileAds = (await import('react-native-google-mobile-ads')).default;
              await mobileAds().initialize();
              console.log(`[AdMob] Initialized successfully (attempt ${attempt})`);

              // DEV 모드에서 테스트 기기 설정
              await mobileAds().setRequestConfiguration({
                testDeviceIdentifiers: ['EMULATOR'],
              });
              console.log('[AdMob] Test device configuration set');
            } catch (error) {
              if (attempt >= maxAttempts) {
                console.error('[AdMob] Max retry attempts reached, giving up');
                return;
              }
              const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s, 8s, 16s
              console.warn(`[AdMob] Initialization failed, retrying in ${delay / 1000}s (${attempt}/${maxAttempts})`, error);
              setTimeout(() => initializeAdMobWithRetry(attempt + 1, maxAttempts), delay);
            }
          };

          initializeAdMobWithRetry();
        }

        // 독립적인 초기화 작업들을 병렬로 실행
        await Promise.all([
          initDeviceId(),
          initOnboarding(),
          loadProfiles(),
        ]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // 에러 발생 시에도 스플래시를 숨기고 앱 진행
      } finally {
        // 초기화 성공/실패 여부와 관계없이 스플래시 숨김
        await SplashScreen.hideAsync();
      }
    };

    initialize().then();
  }, [initDeviceId, initOnboarding, loadProfiles]);
  // endregion

  return (
    <QueryProvider>
      <Stack>
        {SCREEN_CONFIGS.map((screen) => (
          <Stack.Screen key={screen.name} {...screen} />
        ))}
      </Stack>
      <GlobalLoadingOverlay />
    </QueryProvider>
  );
}
