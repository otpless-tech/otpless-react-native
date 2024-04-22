#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(OtplessReactNative, RCTEventEmitter<RCTBridgeModule>)


RCT_EXTERN_METHOD(setLoaderVisibility:(BOOL)isVisible)

RCT_EXTERN_METHOD(showOtplessLoginPage:(NSDictionary *)param
                  withCallback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(isWhatsappInstalled:(RCTResponseSenderBlock)callback)

@end

