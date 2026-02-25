import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import useAppStore from '@/store/useAppStore';
import useProfileStore from '@/store/useProfileStore';
import { GlobalLoadingOverlay } from '@/components';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
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
  const initOnboarding = useAppStore((s) => s.initOnboarding);
  const loadProfiles = useProfileStore((s) => s.loadProfiles);
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    const initialize = async () => {
      if (Platform.OS === 'ios') {
        const { requestTrackingPermissionsAsync } = await import('expo-tracking-transparency');
        await requestTrackingPermissionsAsync();
      }
      await initDeviceId();
      await initOnboarding();
      await loadProfiles();
      SplashScreen.hideAsync();
    };

    initialize();
  }, []);
  // endregion

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="consent"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
        <Stack.Screen name="fortune" options={{ headerShown: false }} />
        <Stack.Screen name="terms" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="ai-notice" options={{ headerShown: false }} />
        <Stack.Screen name="profiles/new" options={{ headerShown: false }} />
        <Stack.Screen name="profiles/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <GlobalLoadingOverlay />
    </QueryClientProvider>
  );
}
