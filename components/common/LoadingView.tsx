import React from 'react'
import { View, ActivityIndicator } from 'react-native'


export default function LoadingView() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#6b7280"/>
    </View>
  )
}
