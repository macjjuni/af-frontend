import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  // region [hooks]
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderTopColor: isDark ? '#1f2937' : '#f3f4f6',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: (iconProps) =>
            <Ionicons name="home" {...iconProps} />,
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: '프로필',
          tabBarIcon: (iconProps) =>
            <Ionicons name="people" {...iconProps} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: (iconProps) =>
            <Ionicons name="settings" {...iconProps} />,
        }}
      />
    </Tabs>
  );
}
