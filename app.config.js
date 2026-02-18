const IS_PROD = process.env.APP_ENV === 'production';

// Google 공식 테스트용 App ID
const ADMOB_TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const ADMOB_TEST_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

// 실제 운영용 App ID
const ADMOB_PROD_ANDROID_APP_ID = 'ca-app-pub-7285750037307016~3406630917';
const ADMOB_PROD_IOS_APP_ID = 'ca-app-pub-7285750037307016~8209732584';

const androidAppId = IS_PROD ? ADMOB_PROD_ANDROID_APP_ID : ADMOB_TEST_ANDROID_APP_ID;
const iosAppId = IS_PROD ? ADMOB_PROD_IOS_APP_ID : ADMOB_TEST_IOS_APP_ID;

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    'expo-router',
    [
      'react-native-google-mobile-ads',
      { androidAppId, iosAppId },
    ],
  ],
});
