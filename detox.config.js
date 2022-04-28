module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  skipLegacyWorkersInjection: true,
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'SPECIFY_PATH_TO_YOUR_APP_BINARY',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/releaseE2E/app-releaseE2E.apk',
      build:
        'cd android && ./gradlew assembleReleaseE2E assembleAndroidTest -DtestBuildType=releaseE2E && cd ..',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 11',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Nexus5X_API_30',
      },
    },
  },
  configurations: {
    ios: {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};
