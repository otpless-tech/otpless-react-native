import OtplessSDK


@objc(OtplessReactNative)
class OtplessReactNative: RCTEventEmitter, onResponseDelegate {
    private var isFromEvent: Bool = true
    private var responseSenderCallback: RCTResponseSenderBlock? = nil
    
    func onResponse(response: OtplessSDK.OtplessResponse?) {
        var params = [String: Any]()
        if (response != nil && response?.errorString != nil){
            params["errorMessage"] = response?.errorString
        } else {
            if response != nil && response?.responseData != nil {
                params =  response!.responseData!
            }
        }
        if(isFromEvent) {
            sendEvent(withName: "OTPlessSignResult", body: params)
        } else {
            self.responseSenderCallback!([params])
            self.responseSenderCallback = nil
        }
    }
    
    override func supportedEvents() -> [String]! {
        return ["OTPlessSignResult"]
    }
    
    @objc(startOtplessWithEvent)
    func startOtplessWithEvent() {
        isFromEvent = true
        let viewController = UIApplication.shared.delegate?.window??.rootViewController;
        Otpless.sharedInstance.delegate = self
        Otpless.sharedInstance.start(vc: viewController!)
    }
    
    @objc(startOtplessWithCallback:)
    func startOtplessWithCallback(callback: @escaping RCTResponseSenderBlock) {
        isFromEvent = false
        self.responseSenderCallback = callback
        let viewController = UIApplication.shared.delegate?.window??.rootViewController;
        Otpless.sharedInstance.delegate = self
        Otpless.sharedInstance.start(vc: viewController!)
    }
    
    @objc(startOtplessWithCallbackParams:withCallback:)
    func startOtplessWithCallbackParams(param: [String : Any]?, callback: @escaping RCTResponseSenderBlock) {
        isFromEvent = false
        self.responseSenderCallback = callback
        let viewController = UIApplication.shared.delegate?.window??.rootViewController;
        Otpless.sharedInstance.delegate = self
        Otpless.sharedInstance.startwithParams(vc: viewController!, params: param)
    }
    
    @objc(onSignInCompleted)
    func onSignInCompleted() {
        Otpless.sharedInstance.onSignedInComplete()
    }
    
    @objc(showFabButton:)
    func showFabButton(isShowFab: Bool) {
        Otpless.sharedInstance.shouldHideButton(hide: isShowFab)
    }
}
