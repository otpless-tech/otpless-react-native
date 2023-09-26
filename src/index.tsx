import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

const LINKING_ERROR =
  `The package 'otpless-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const OtplessReactNative = NativeModules.OtplessReactNative
  ? NativeModules.OtplessReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

interface HasWhatsappCallback {
  (hasWhatsapp: boolean): void;
}

class OtplessBaseModule {
  onSignInCompleted() {
    OtplessReactNative.onSignInCompleted();
  }
  showFabButton(isShowFab: boolean) {
    OtplessReactNative.showFabButton(isShowFab);
  }
  isWhatsappInstalled(callback: HasWhatsappCallback) {
    OtplessReactNative.isWhatsappInstalled((result: any) => {
      const hasWhatsapp = result.hasWhatsapp === true;
      callback(hasWhatsapp);
    });
  }
}

interface OtplessResultCallback {
  (result: any): void;
}

class OtplessEventModule extends OtplessBaseModule {
  private eventEmitter: NativeEventEmitter;

  constructor(callback: OtplessResultCallback) {
    super();
    this.eventEmitter = new NativeEventEmitter(OtplessReactNative);
    this.eventEmitter.addListener('OTPlessSignResult', (result) => {
      callback(result);
    });
  }

  start(input: any = null) {
    if (input == null) {
      OtplessReactNative.startOtplessWithEvent();
    } else {
      OtplessReactNative.startOtplessWithEventParams(input);
    }
  }

  clearListener() {
    this.eventEmitter.removeAllListeners;
  }
}

class OtplessModule extends OtplessBaseModule {
  start(callback: OtplessResultCallback) {
    OtplessReactNative.startOtplessWithCallback((result: any) => {
      callback(result);
    });
  }

  startWithParams(input: any, callback: OtplessResultCallback) {
    OtplessReactNative.startOtplessWithCallbackParams(input, (result: any) => {
      callback(result);
    });
  }

  showLoginPage(callback: OtplessResultCallback, input: any | null = null) {
    OtplessReactNative.showOtplessLoginPage(input, (result: any) => {
      callback(result);
    });
  }
}

export { OtplessEventModule, OtplessModule };
