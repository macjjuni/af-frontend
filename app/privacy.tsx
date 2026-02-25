import React from 'react'
import { ScrollView, useColorScheme, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Markdown from 'react-native-markdown-display'
import { ScreenHeader } from '@/components'
import { PRIVACY_POLICY_TEXT } from '@/constants/privacyPolicy'

export default function PrivacyPolicy() {

  // region [hooks]
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScreenHeader title="개인정보처리방침" centerTitle />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
      >
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <Markdown style={getMarkdownStyles(isDark)}>{PRIVACY_POLICY_TEXT}</Markdown>
        </View>
      </ScrollView>
    </View>
  )
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
    table: {
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#e5e7eb',
      borderRadius: 8,
      marginVertical: 12,
    },
    thead: {
      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
    },
    tbody: {},
    th: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: isDark ? '#f9fafb' : '#1f2937',
      padding: 8,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#e5e7eb',
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: isDark ? '#374151' : '#e5e7eb',
    },
    td: {
      fontSize: 14,
      color: isDark ? '#d1d5db' : '#374151',
      padding: 8,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#e5e7eb',
    },
    blockquote: {
      backgroundColor: isDark ? '#1e1b4b' : '#f5f3ff',
      borderLeftColor: '#7c3aed',
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
  }
}
