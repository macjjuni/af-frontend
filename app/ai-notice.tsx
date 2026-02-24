import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { AI_NOTICE_TEXT } from '@/constants/aiNotice';

export default function AINoticeScreen() {
  // region [hooks]
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  // region [Events]
  function onPressBack() {
    router.back();
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onPressBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#7c3aed" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">AI 이용 안내</Text>
          <View style={{ width: 28 }} />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
      >
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <Markdown style={getMarkdownStyles(isDark)}>{AI_NOTICE_TEXT}</Markdown>
        </View>
      </ScrollView>
    </View>
  );
}

function getMarkdownStyles(isDark: boolean) {
  return {
    body: {
      color: isDark ? '#d1d5db' : '#374151',
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      fontSize: 24,
      lineHeight: 28,
      fontWeight: '700' as const,
      color: isDark ? '#f9fafb' : '#1f2937',
      marginTop: 8,
      marginBottom: 12,
    },
    heading2: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: isDark ? '#a5b4fc' : '#3730a3',
      marginTop: 20,
      marginBottom: 8,
    },
    heading3: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: isDark ? '#9ca3af' : '#4b5563',
      marginTop: 16,
      marginBottom: 6,
    },
    strong: {
      fontWeight: '700' as const,
      color: isDark ? '#f9fafb' : '#1f2937',
    },
    em: {
      fontStyle: 'italic' as const,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    paragraph: {
      fontSize: 15,
      marginTop: 4,
      marginBottom: 8,
      lineHeight: 22,
    },
    bullet_list: {
      fontSize: 15,
      marginVertical: 6,
    },
    ordered_list: {
      marginVertical: 6,
    },
    list_item: {
      marginVertical: 3,
      fontSize: 15,
      lineHeight: 22,
    },
    hr: {
      backgroundColor: isDark ? '#374151' : '#e5e7eb',
      height: 1,
      marginVertical: 16,
    },
    blockquote: {
      backgroundColor: isDark ? '#78350f' : '#fef3c7',
      borderLeftColor: '#f59e0b',
      borderLeftWidth: 4,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 4,
      marginVertical: 8,
    },
    code_inline: {
      backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
      color: isDark ? '#c4b5fd' : '#7c3aed',
      borderRadius: 4,
      paddingHorizontal: 4,
      fontSize: 14,
    },
  };
}
