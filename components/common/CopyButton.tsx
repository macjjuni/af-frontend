import React, { useState } from 'react';
import { TouchableOpacity, Text, useColorScheme } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface CopyButtonProps {
  getText: () => string | Promise<string>;
  label?: string;
}

export default function CopyButton({ getText, label = '복사' }: CopyButtonProps) {
  // region [hooks]
  const [copied, setCopied] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  // region [Events]
  async function onPress() {
    const text = await getText();
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  // endregion

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: copied ? '#6b7280' : (isDark ? '#4b5563' : '#d1d5db'),
        borderRadius: 6,
        backgroundColor: copied ? (isDark ? '#374151' : '#f3f4f6') : (isDark ? '#1f2937' : '#fff'),
      }}
      activeOpacity={0.7}
    >
      <Text style={{ fontSize: 11, color: copied ? (isDark ? '#d1d5db' : '#374151') : (isDark ? '#9ca3af' : '#6b7280') }}>
        {copied ? '복사됨 ✓' : label}
      </Text>
    </TouchableOpacity>
  );
}
