import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Markdown from 'react-native-markdown-display'
import useFortuneStore from '@/store/useFortuneStore'
import { MarkdownSkeleton } from '@/components/common'

export default function FortuneScreen() {

  // region [hooks]
  const fortuneResult = useFortuneStore((s) => s.fortuneResult)
  const isLoading = useFortuneStore((s) => s.isLoading)
  const error = useFortuneStore((s) => s.error)
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

  return (
    <View className="flex-1 bg-purple-950 dark:bg-indigo-950" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-2.5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* 화려한 타이틀 */}
        <View className="py-6 items-center">
          <Text className="text-5xl leading-[56px] mb-3">✨🔮✨</Text>
          <Text
            className="text-4xl font-black text-center text-purple-100"
            style={{
              textShadowColor: '#a78bfa',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
            }}
          >
            AI 분석 결과
          </Text>
        </View>

        {/* 다층 Glow 카드 */}
        <View
          className="rounded-3xl p-0"
          style={{
            backgroundColor: '#a78bfa',
            shadowColor: '#7c3aed',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.6,
            shadowRadius: 30,
            elevation: 20,
          }}
        >
          <View className="rounded-[22px]" style={{ backgroundColor: '#c4b5fd' }}>
            <View
              className="bg-white dark:bg-gray-900 rounded-[20px] px-4 py-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
              }}
            >
              {isLoading ? (
                <MarkdownSkeleton />
              ) : error ? (
                <View className="py-8 items-center">
                  <Text className="text-3xl mb-4">⚠️</Text>
                  <Text className="text-red-500 dark:text-red-400 text-center text-xl font-bold">{error}</Text>
                </View>
              ) : fortuneResult ? (
                <Markdown style={getMarkdownStyles(isDark)}>{fixBoldAroundQuotes(fortuneResult.result)}</Markdown>
              ) : (
                <View className="py-8 items-center">
                  <Text className="text-3xl mb-4">🔍</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-center text-xl">분석 결과가 없습니다.</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 화려한 버튼 */}
      <View className="px-4 pt-5 pb-10 bg-purple-900/80 dark:bg-indigo-950/80 border-t-2 border-purple-400/30">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-purple-600 py-4 rounded-2xl items-center"
          style={{
            shadowColor: '#7c3aed',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 12,
          }}
          activeOpacity={0.85}
        >
          <Text className="text-white font-black text-2xl">뒤로가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function getMarkdownStyles(isDark: boolean) {
  return {
    body: {
      color: isDark ? '#e5e7eb' : '#1f2937',
      fontSize: 17,
      lineHeight: 27,
    },
    heading1: {
      fontSize: 26,
      lineHeight: 34,
      fontWeight: '700' as const,
      color: isDark ? '#f9fafb' : '#111827',
      marginTop: 20,
      marginBottom: 10,
    },
    heading2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700' as const,
      color: isDark ? '#c4b5fd' : '#7c3aed',
      marginTop: 18,
      marginBottom: 8,
    },
    heading3: {
      fontSize: 19,
      lineHeight: 28,
      fontWeight: '600' as const,
      color: isDark ? '#a78bfa' : '#6d28d9',
      marginTop: 16,
      marginBottom: 6,
    },
    strong: {
      fontWeight: '700' as const,
      color: isDark ? '#f9fafb' : '#111827',
    },
    em: {
      fontStyle: 'italic' as const,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    paragraph: {
      fontSize: 17,
      lineHeight: 27,
      marginTop: 6,
      marginBottom: 12,
    },
    bullet_list: {
      fontSize: 17,
      lineHeight: 26,
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    list_item: {
      marginVertical: 4,
      fontSize: 17,
      lineHeight: 26,
    },
    hr: {
      backgroundColor: isDark ? '#374151' : '#e5e7eb',
      height: 1,
      marginVertical: 16,
    },
    blockquote: {
      backgroundColor: isDark ? '#1e1b4b' : '#f5f3ff',
      borderLeftColor: '#7c3aed',
      borderLeftWidth: 4,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 6,
      marginVertical: 12,
    },
    code_inline: {
      backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
      color: isDark ? '#c4b5fd' : '#7c3aed',
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 16,
      lineHeight: 22,
    },
  }
}
