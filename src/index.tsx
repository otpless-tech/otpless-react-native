import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';

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
// Singleton class to prevent multiple listeners from being created.
class OtplessSimUtils {
  private static instance: OtplessSimUtils | null = null;
  private simEventEmitter: NativeEventEmitter;

  private constructor() {
    this.simEventEmitter = new NativeEventEmitter(OtplessReactNative);
  }

  public static getInstance(): OtplessSimUtils {
    if (this.instance === null) {
      this.instance = new OtplessSimUtils();
    }
    return this.instance;
  }

  public getEjectedSimsEntries(): Promise<any[]> {
    return OtplessReactNative.getEjectedSimsEntries()
  }

  public setupSimStatusChangeListener(callback: (entries: any[]) => void) {
    OtplessReactNative.setSimEjectionListener(true);
    this.simEventEmitter.addListener('otpless_sim_status_change_event', (event) => {
      const simEntries = event.simEntries;
      callback(simEntries);
    });
  }

  public detachSimEjectionListener() {
    OtplessReactNative.setSimEjectionListener(false);
    this.simEventEmitter.removeAllListeners('otpless_sim_status_change_event');
  }
}



class OtplessBaseModule {
  isWhatsappInstalled(callback: HasWhatsappCallback) {
    OtplessReactNative.isWhatsappInstalled((result: any) => {
      const hasWhatsapp = result.hasWhatsapp === true;
      callback(hasWhatsapp);
    });
  }

  attachSecureSDK(appId: string): Promise<void> {
    return OtplessReactNative.attachSecureSDK(appId)
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
    this.eventEmitter?.removeAllListeners('OTPlessEventResult');
  }

  initHeadless(appId: String, loginUri: string | null = null, timeout: number = 30.0) {
    if (this.eventEmitter == null) {
      this.eventEmitter = new NativeEventEmitter(OtplessReactNative);
    }
    // call the native method
    OtplessReactNative.initHeadless(appId, loginUri, timeout);
  }

  setHeadlessCallback(callback: OtplessResultCallback) {
    this.eventEmitter!!.addListener('OTPlessEventResult', callback);
    // call the native method
    OtplessReactNative.setHeadlessCallback()
  }

  startHeadless(input: any) {
    OtplessReactNative.startHeadless(input);
  }

  showPhoneHint(showFallback: boolean, callback: (result: any) => void) {
    OtplessReactNative.showPhoneHintLib(showFallback, callback);
  }

  commitResponse(response: any) {
    OtplessReactNative.commitResponse(response);
  }
}

class OtplessModule extends OtplessBaseModule {

  showLoginPage(callback: OtplessResultCallback, input: any) {
    OtplessReactNative.showOtplessLoginPage(input, (result: any) => {
      callback(result);
    });
  }
}

export { OtplessModule, OtplessHeadlessModule, OtplessSimUtils };
