import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Platform, type DimensionValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  maxHeight?: DimensionValue;
  children: React.ReactNode;
}

export default function BottomSheet({
  visible,
  onClose,
  title,
  maxHeight = '60%',
  children,
}: BottomSheetProps) {
  // region [hooks]
  const insets = useSafeAreaInsets();
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(600)).current;
  // endregion

  // region [Events]
  function handleClose() {
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(sheetTranslateY, { toValue: 600, duration: 250, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start(() => onClose());
  }
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (visible) {
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(600);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 250, useNativeDriver: USE_NATIVE_DRIVER }),
        Animated.timing(sheetTranslateY, { toValue: 0, duration: 300, useNativeDriver: USE_NATIVE_DRIVER }),
      ]).start();
    }
  }, [visible]);
  // endregion

  return (
    <Modal visible={visible} animationType="none" transparent>
      <View style={{ flex: 1 }}>
        {/* Overlay: 제자리에서 페이드인 */}
        <Animated.View
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: overlayOpacity,
          }}
        />
        {/* 외부 탭 시 닫기 */}
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={handleClose}
          activeOpacity={1}
        />
        {/* 시트: 하단 절대 고정 + 슬라이드업 */}
        <Animated.View
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '100%',
            maxHeight,
            transform: [{ translateY: sheetTranslateY }],
          }}
        >
          <View
            className="bg-white dark:bg-gray-800 rounded-t-3xl h-full"
            style={{ paddingBottom: insets.bottom }}
          >
            {/* 헤더 */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
              <TouchableOpacity onPress={handleClose} className="p-1">
                <Text className="text-gray-600 dark:text-gray-400 font-bold text-[20px]">✕</Text>
              </TouchableOpacity>
            </View>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
