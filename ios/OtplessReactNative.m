#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(OtplessReactNative, RCTEventEmitter<RCTBridgeModule>)

RCT_EXTERN_METHOD(startOtplessWithEvent)

RCT_EXTERN_METHOD(onSignInCompleted)

RCT_EXTERN_METHOD(showFabButton:(bool)isShowFab)

RCT_EXTERN_METHOD(startOtplessWithEventParams:(NSDictionary *)param)

RCT_EXTERN_METHOD(startOtplessWithCallback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(startOtplessWithCallbackParams:(NSDictionary *)param
                  withCallback: (RCTResponseSenderBlock)callback)


@end

