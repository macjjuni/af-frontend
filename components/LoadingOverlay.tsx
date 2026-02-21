import React from 'react'
import { Modal, View, Text, ActivityIndicator } from 'react-native'


interface LoadingOverlayProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  thirdtitle?: string;
}

export default function LoadingOverlay({ visible, title, subtitle, thirdtitle }: LoadingOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 items-center" style={{ minWidth: 200 }}>
          <ActivityIndicator size="large" color="#7c3aed"/>
          {title && (
            <Text className="text-gray-800 dark:text-gray-100 text-xl font-medium mt-4">{title}</Text>
          )}
          {subtitle && (
            <Text className="text-gray-400 text-md mt-1">{subtitle}</Text>
          )}
          {thirdtitle && (
            <Text className="text-gray-400 text-md mt-1">{thirdtitle}</Text>
          )}
        </View>
      </View>
    </Modal>
  )
}
