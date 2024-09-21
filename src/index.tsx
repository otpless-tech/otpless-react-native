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

  setWebViewInspectable(isInspectable: boolean) {
    OtplessReactNative.setWebViewInspectable(isInspectable)
  }

  enableDebugLogging(isEnabled: boolean) {
    OtplessReactNative.enableDebugLogging(isEnabled)
  }
}

interface OtplessResultCallback {
  (result: any): void;
}

class OtplessHeadlessModule extends OtplessBaseModule {
  private eventEmitter: NativeEventEmitter | null = null;

  constructor() {
    super();
    this.eventEmitter = null;
  }

  clearListener() {
    this.eventEmitter?.removeAllListeners;
  }

  initHeadless(appId: String) {
    if (this.eventEmitter == null) {
      this.eventEmitter = new NativeEventEmitter(OtplessReactNative);
    }
    // call the native method
    OtplessReactNative.initHeadless(appId);
  }

  setHeadlessCallback(callback: OtplessResultCallback) {
    this.eventEmitter!!.addListener('OTPlessEventResult', callback);
    // call the native method
    OtplessReactNative.setHeadlessCallback()
  }

  startHeadless(input: any) {
    OtplessReactNative.startHeadless(input);
  }
}

class OtplessModule extends OtplessBaseModule {

  showLoginPage(callback: OtplessResultCallback, input: any) {
    OtplessReactNative.showOtplessLoginPage(input, (result: any) => {
      callback(result);
    });
  }
}

export { OtplessModule, OtplessHeadlessModule };
