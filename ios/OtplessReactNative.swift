import OtplessSDK


@objc(OtplessReactNative)
class OtplessReactNative: RCTEventEmitter, onResponseDelegate {
    
    // get the callback for promise
    private var rctCallbackWrapper: RCTSenderWrapper? = nil
    
    // get the callback for event in this object
    func onResponse(response: OtplessSDK.OtplessResponse?) {
        var params = [String: Any]()
        if (response != nil && response?.errorString != nil){
            params["errorMessage"] = response?.errorString
        } else {
            if response != nil && response?.responseData != nil {
                params["data"] =  response!.responseData!
            }
        }
        sendEvent(withName: "OTPlessSignResult", body: params)
    }
    
    override func supportedEvents() -> [String]! {
        return ["OTPlessSignResult"]
    }
    
    @objc(startOtplessWithEvent)
    func startOtplessWithEvent() {
        Otpless.sharedInstance.delegate = self
        runOnMain {
            let viewController = UIApplication.shared.delegate?.window??.rootViewController;
            Otpless.sharedInstance.start(vc: viewController!)
        }
    }
    
    @objc(startOtplessWithEventParams:)
    func startOtplessWithEventParams(param: [String : Any]?) {
        Otpless.sharedInstance.delegate = self
        runOnMain {
            let viewController = UIApplication.shared.delegate?.window??.rootViewController;
            Otpless.sharedInstance.startwithParams(vc: viewController!, params: param)
        }
    }
    
    @objc(startOtplessWithCallback:)
    func startOtplessWithCallback(callback: @escaping RCTResponseSenderBlock) {
        self.rctCallbackWrapper = RCTSenderWrapper(callback: callback)
        Otpless.sharedInstance.delegate = self.rctCallbackWrapper
        runOnMain {
            Otpless.sharedInstance.shouldHideButton(hide: true)
            let viewController = UIApplication.shared.delegate?.window??.rootViewController;
            Otpless.sharedInstance.start(vc: viewController!)
        }
    }
    
    @objc(startOtplessWithCallbackParams:withCallback:)
    func startOtplessWithCallbackParams(param: [String : Any]?, callback: @escaping RCTResponseSenderBlock) {
        self.rctCallbackWrapper = RCTSenderWrapper(callback: callback)
        Otpless.sharedInstance.delegate = self.rctCallbackWrapper
        runOnMain {
            Otpless.sharedInstance.shouldHideButton(hide: true)
            let viewController = UIApplication.shared.delegate?.window??.rootViewController;
            Otpless.sharedInstance.startwithParams(vc: viewController!, params: param)
        }
    }
    
    @objc(onSignInCompleted)
    func onSignInCompleted() {
        runOnMain {
            Otpless.sharedInstance.onSignedInComplete()
        }
    }
    
    @objc(showFabButton:)
    func showFabButton(isShowFab: Bool) {
        Otpless.sharedInstance.shouldHideButton(hide: !isShowFab)
    }
    
    @objc(showOtplessLoginPage:withCallback:)
    func showOtplessLoginPage(param: [String: Any]?, callback: @escaping RCTResponseSenderBlock) {
        self.rctCallbackWrapper = RCTSenderWrapper(callback: callback)
        Otpless.sharedInstance.delegate = self.rctCallbackWrapper
        runOnMain {
            Otpless.sharedInstance.shouldHideButton(hide: true)
            let viewController = UIApplication.shared.delegate?.window??.rootViewController;
            if let validParam = param {
                Otpless.sharedInstance.showOtplessLoginPageWithParams(vc: viewController!, params: validParam)
            } else {
                Otpless.sharedInstance.showOtplessLoginPage(vc: viewController!)
            }
        }
    }
}

extension OtplessReactNative {
    func runOnMain(callback: @escaping (() -> Void)) {
        DispatchQueue.main.async {
            callback()
        }
    }
}

class RCTSenderWrapper: onResponseDelegate {
    private let callback:RCTResponseSenderBlock
    private var isCallbackUsed = false
    
    init(callback: @escaping RCTResponseSenderBlock) {
        self.callback = callback
    }
    
    func onResponse(response: OtplessSDK.OtplessResponse?) {
        if (isCallbackUsed) {
            return
        }
        var params = [String: Any]()
        if (response != nil && response?.errorString != nil){
            params["errorMessage"] = response?.errorString
        } else {
            if response != nil && response?.responseData != nil {
                params["data"] =  response!.responseData!
            }
        }
        self.callback([params])
        isCallbackUsed = true
    }
}
