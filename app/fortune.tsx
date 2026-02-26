import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Markdown from 'react-native-markdown-display'
import useFortuneStore from '@/store/useFortuneStore'

export default function FortuneScreen() {

  // region [hooks]
  const fortuneResult = useFortuneStore((s) => s.fortuneResult)
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  // endregion

  // region [Privates]
  const fixBoldAroundQuotes = (text: string) =>
    text
      .replace(/\*\*"/g, '"**').replace(/"\*\*/g, '**"')
      .replace(/\*\*'/g, '\'**').replace(/'\*\*/g, '**\'')
  // endregion

  if (!fortuneResult) return null

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="py-4">
          <Text className="text-[20px] font-bold text-center text-gray-900 dark:text-gray-100">AI 분석 결과</Text>
        </View>
        <View className="bg-white dark:bg-gray-800 rounded-xl px-5 pt-4 pb-5 border border-purple-100 dark:border-purple-900">
          <Markdown style={getMarkdownStyles(isDark)}>{fixBoldAroundQuotes(fortuneResult.result)}</Markdown>
        </View>
      </ScrollView>

      <View className="px-4 pt-3 pb-10 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-100 dark:bg-gray-800 py-3 rounded-xl items-center"
          activeOpacity={0.85}
        >
          <Text className="text-black dark:text-white font-semibold text-lg">뒤로가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function getMarkdownStyles(isDark: boolean) {
  return {
    body: {
      color: isDark ? '#d1d5db' : '#374151',
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '700' as const,
      color: isDark ? '#f9fafb' : '#1f2937',
      marginTop: 8,
      marginBottom: 6,
    },
    heading2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700' as const,
      color: isDark ? '#a5b4fc' : '#3730a3',
      marginTop: 16,
      marginBottom: 4,
    },
    heading3: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '600' as const,
      color: isDark ? '#9ca3af' : '#4b5563',
      marginTop: 12,
      marginBottom: 4,
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
      fontSize: 18,
      lineHeight: 24,
      marginTop: 4,
      marginBottom: 6,
    },
    bullet_list: {
      fontSize: 16,
      lineHeight: 22,
      marginVertical: 4,
    },
    ordered_list: {
      marginVertical: 4,
    },
    list_item: {
      marginVertical: 2,
    },
    hr: {
      backgroundColor: isDark ? '#374151' : '#e5e7eb',
      height: 1,
      marginVertical: 12,
    },
    blockquote: {
      backgroundColor: isDark ? '#1e1b4b' : '#f5f3ff',
      borderLeftColor: '#7c3aed',
      borderLeftWidth: 4,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 4,
      marginVertical: 8,
    },
    code_inline: {
      backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
      color: isDark ? '#c4b5fd' : '#7c3aed',
      borderRadius: 4,
      paddingHorizontal: 4,
      fontSize: 16,
      lineHeight: 20,
    },
  }
}
