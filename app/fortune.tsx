import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, useColorScheme, Share } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Markdown from 'react-native-markdown-display'
import { Ionicons } from '@expo/vector-icons'
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

  const convertMarkdownToPlainText = (markdown: string): string => {
    return markdown
      .replace(/^#+\s+/gm, '')           // ## Title → Title
      .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** → bold
      .replace(/\*(.+?)\*/g, '$1')       // *italic* → italic
      .replace(/^[\*\-]\s+/gm, '• ')     // - item → • item
      .replace(/^>\s+/gm, '')            // > quote → quote
      .replace(/`(.+?)`/g, '$1')         // `code` → code
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // [text](url) → text
      .replace(/\n{3,}/g, '\n\n')        // 여러 줄바꿈 정리
      .trim()
  }
  // endregion

  // region [Events]
  async function onPressShare() {
    if (!fortuneResult?.result) return

    try {
      const plainText = convertMarkdownToPlainText(fortuneResult.result)
      const shareContent = `✨ AI 분석 결과 ✨\n\n${plainText}\n\n#{{AppName}}`

      await Share.share({
        message: shareContent,
        title: '{{AppName}} 결과',  // Android only
      })
    } catch (error) {
      console.error('Share failed:', error)
    }
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 px-2.5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* 타이틀 */}
        <View className="py-6 items-center mb-4">
          <Text className="text-5xl leading-[56px] mb-3">✨🔮✨</Text>
          <Text className="text-4xl font-black text-center text-gray-900 dark:text-gray-100">
            AI 분석 결과
          </Text>
        </View>

        {/* 깔끔한 카드 */}
        <View>
          <View
            className="rounded-3xl p-0 mx-2 mb-6"
            style={{
              backgroundColor: isDark ? '#374151' : '#e5e7eb',
              shadowColor: isDark ? '#000' : '#6b7280',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.4 : 0.3,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <View className="rounded-[22px]" style={{ backgroundColor: isDark ? '#4b5563' : '#f3f4f6' }}>
              <View
                className="bg-white dark:bg-gray-900 rounded-[20px] px-4 pt-4 pb-6"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                }}
              >
                {fortuneResult ? (
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

          {/* 공유하기 버튼 - 리퀴드 스타일 */}
          {fortuneResult && (
            <TouchableOpacity
              onPress={onPressShare}
              className="py-4 px-8 mx-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full"
              style={{
                shadowColor: isDark ? '#fff' : '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isDark ? 0.05 : 0.08,
                shadowRadius: 24,
                elevation: 2,
              }}
              activeOpacity={0.6}
            >
              <View className="flex-row items-center justify-center gap-3">
                <Ionicons name="share-outline" size={22} color={isDark ? '#e5e7eb' : '#1f2937'} />
                <Text className="text-gray-800 dark:text-gray-200 font-semibold text-lg">공유하기</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* 뒤로가기 버튼 - 리퀴드 스타일 */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-4 px-8 mt-3 mx-2 mb-8 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full"
            style={{
              shadowColor: isDark ? '#fff' : '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.05 : 0.08,
              shadowRadius: 24,
              elevation: 2,
            }}
            activeOpacity={0.6}
          >
            <View className="flex-row items-center justify-center gap-3">
              <Ionicons name="arrow-back" size={22} color={isDark ? '#e5e7eb' : '#1f2937'} />
              <Text className="text-gray-800 dark:text-gray-200 font-semibold text-lg">뒤로가기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
