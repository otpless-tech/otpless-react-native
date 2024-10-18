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

  showPhoneHint(showFallback: boolean, callback: (result: any) => void) {
    OtplessReactNative.showPhoneHintLib(showFallback, callback)
  }
}

class OtplessModule extends OtplessBaseModule {

  showLoginPage(callback: OtplessResultCallback, input: any) {
    OtplessReactNative.showOtplessLoginPage(input, (result: any) => {
      callback(result);
    });
  }
}

class OtplessSecureSDK extends OtplessBaseModule {
  private eventEmitter: NativeEventEmitter;

  constructor() {
    super()
    this.eventEmitter = new NativeEventEmitter(OtplessReactNative);
  }


  attachSecureSDK(appId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      OtplessReactNative.attachSecureSDK(appId)
        .then(() => {
          resolve();
        })
        .catch((error: any) => {
          reject(new Error(error.message || "Failed to attach secure SDK"));
        });
    });
  }

  getEjectedSimsEntries(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      OtplessReactNative.getEjectedSimsEntries()
        .then((result: any) => {
          if (Array.isArray(result)) { // Ensure we're getting an array
            resolve(result);
          } else {
            reject(new Error('Result is not an array'));
          }
        })
        .catch((error: any) => {
          reject(new Error('Failed to fetch ejected SIM entries: ' + error));
        });
    });
  }

  setupSimStatusChangeListener(callback: (entries: any[]) => void) {
    OtplessReactNative.setSimEjectionListener(true);
    this.eventEmitter.addListener('otpless_sim_status_change_event', (event) => {
      console.log('Sim status changed:', event);
      const simEntries = event.simEntries;
      callback(simEntries);
    });
  }

  detachSimEjectionListener() {
    OtplessReactNative.setSimEjectionListener(false);
    this.eventEmitter.removeAllListeners('otpless_sim_status_change_event');
  }

}

export { OtplessModule, OtplessHeadlessModule, OtplessSecureSDK };
