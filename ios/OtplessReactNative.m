#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(OtplessReactNative, RCTEventEmitter<RCTBridgeModule>)

RCT_EXTERN_METHOD(startOtplessWithEvent)

RCT_EXTERN_METHOD(startOtplessWithCallback:(RCTResponseSenderBlock)callback)

RCT_EXPORT_METHOD(startOtplessWithCallbackParams:(NSDictionary *)param
                  withCallback: (RCTResponseSenderBlock)callback)
{
}

RCT_EXPORT_METHOD(onSignInCompleted)
{
}

RCT_EXPORT_METHOD(showFabButton:(bool)isShowFab)
{
}

@end
