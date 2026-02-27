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
        <View className="items-center rounded-2xl bg-white dark:bg-gray-900 px-8 py-6">
          <LottieView
            source={require('@/assets/lotties/ai.json')}
            autoPlay
            loop
            style={{ width: 180, height: 180, marginTop: -20, marginBottom: -16 }}
          />
          {globalLoading.message && (
            <Text className="mt-1 text-center text-lg text-gray-500 dark:text-gray-400 px-2">
              {globalLoading.message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
