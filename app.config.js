const IS_PROD = process.env.APP_ENV === 'production';

// Google 공식 테스트용 App ID
const ADMOB_TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const ADMOB_TEST_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

// 실제 운영용 App ID
const ADMOB_PROD_ANDROID_APP_ID = 'ca-app-pub-7285750037307016~3406630917';
const ADMOB_PROD_IOS_APP_ID = 'ca-app-pub-7285750037307016~8209732584';

const androidAppId = IS_PROD ? ADMOB_PROD_ANDROID_APP_ID : ADMOB_TEST_ANDROID_APP_ID;
const iosAppId = IS_PROD ? ADMOB_PROD_IOS_APP_ID : ADMOB_TEST_IOS_APP_ID;

// API URL (환경변수 필수)
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
}

console.log('[app.config.js] APP_ENV:', process.env.APP_ENV);
console.log('[app.config.js] EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
console.log('[app.config.js] API_URL:', API_URL);

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: API_URL,
  },
  plugins: [
    'expo-router',
    [
      'react-native-google-mobile-ads',
      { androidAppId, iosAppId },
    ],
  ],
});
