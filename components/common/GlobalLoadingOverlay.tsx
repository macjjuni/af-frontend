import { Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import useAppStore from '@/store/useAppStore';

export default function GlobalLoadingOverlay() {
  // region [hooks]
  const globalLoading = useAppStore((state) => state.globalLoading);
  // endregion

  return (
    <Modal
      visible={globalLoading.visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/55">
        <View className="items-center rounded-2xl p-6 bg-white dark:bg-gray-800">
          <LottieView
            source={require('@/assets/lotties/ai.json')}
            autoPlay
            loop
            style={{ width: 180, height: 180, marginTop: -30, marginBottom: -16 }}
          />
          {globalLoading.message && (
            <Text className="mt-1 text-center text-lg text-gray-700 dark:text-gray-300 px-4">
              {globalLoading?.message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
