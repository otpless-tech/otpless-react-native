#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(OtplessReactNative, RCTEventEmitter<RCTBridgeModule>)


RCT_EXTERN_METHOD(setLoaderVisibility:(BOOL)isVisible)

RCT_EXTERN_METHOD(showOtplessLoginPage:(NSDictionary *)param
                  withCallback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(isWhatsappInstalled:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(initHeadless:(NSString *)appId)

RCT_EXTERN_METHOD(setHeadlessCallback)

RCT_EXTERN_METHOD(startHeadless:(NSDictionary *)request)

RCT_EXTERN_METHOD(setWebViewInspectable:(BOOL)isInspectable)

RCT_EXTERN_METHOD(enableOneTap:(BOOL)enable)
@end

