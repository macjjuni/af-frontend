import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import useAppStore from '@/store/useAppStore';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    mutations: { retry: 0 },
  },
});

export default function RootLayout() {
  // region [hooks]
  const initDeviceId = useAppStore((s) => s.initDeviceId);
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'ios') {
        await requestTrackingPermissionsAsync();
      }
      await initDeviceId();
      SplashScreen.hideAsync();
    };

    initialize();
  }, []);
  // endregion

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, title: 'AI 운세 분석' }} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
        <Stack.Screen name="fortune" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: true, title: '개인정보처리방침' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </QueryClientProvider>
  );
}
