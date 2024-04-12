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
  isWhatsappInstalled(callback: HasWhatsappCallback) {
    OtplessReactNative.isWhatsappInstalled((result: any) => {
      const hasWhatsapp = result.hasWhatsapp === true;
      callback(hasWhatsapp);
    });
  }

  setLoaderVisibility(input: boolean) {
    OtplessReactNative.setLoaderVisibility(input); 
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

  clearListener() {
    this.eventEmitter.removeAllListeners;
  }
}

class OtplessModule extends OtplessBaseModule {

  showLoginPage(callback: OtplessResultCallback, input: any) {
    OtplessReactNative.showOtplessLoginPage(input, (result: any) => {
      callback(result);
    });
  }
}

export { OtplessModule };
