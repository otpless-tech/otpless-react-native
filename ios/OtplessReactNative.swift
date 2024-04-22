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
    
    @objc(showFabButton:)
    func setLoaderVisibility(isVisible: Bool) {
        print("loader visibility changed to: \(isVisible) ", terminator: "\n")
    }
    
    @objc(showOtplessLoginPage:withCallback:)
    func showOtplessLoginPage(param: [String: Any], callback: @escaping RCTResponseSenderBlock) {
        self.rctCallbackWrapper = RCTSenderWrapper(callback: callback)
        Otpless.sharedInstance.delegate = self.rctCallbackWrapper
        let appId: String = param["appId"] as! String
        let params = param["params"] as? [String: Any]
        runOnMain {
            let viewController = UIApplication.shared.delegate?.window??.rootViewController;
            Otpless.sharedInstance.showOtplessLoginPageWithParams(appId: appId, vc: viewController!, params: params)
        }
    }
    
    @objc(isWhatsappInstalled:)
    func isWhatsappInstalled(callback: RCTResponseSenderBlock) {
        let hasWhatsapp = Otpless.sharedInstance.isWhatsappInstalled()
        let params = [hasWhatsapp: hasWhatsapp]
        callback([params])
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
