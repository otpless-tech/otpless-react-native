import OtplessSDK


@objc(OtplessReactNative)
class OtplessReactNative: RCTEventEmitter, onResponseDelegate, onHeadlessResponseDelegate {
    
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
        sendEvent(withName: "OTPlessEventResult", body: params)
    }
    
    override func supportedEvents() -> [String]! {
        return ["OTPlessEventResult"]
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
        let params = ["hasWhatsapp": hasWhatsapp]
        callback([params])
    }
    
    @objc(initHeadless:)
    func initHeadless(appId: String) {
        runOnMain {
            let viewController = UIApplication.shared.delegate?.window??.rootViewController
            Otpless.sharedInstance.initialise(vc: viewController!, appId: appId)
        }
    }
    
    @objc(setHeadlessCallback)
    func setHeadlessCallback() {
        Otpless.sharedInstance.headlessDelegate = self
    }
    
    @objc(startHeadless:)
    func startHeadless(request: [String: Any]) {
        let headlessRequest = createHeadlessRequest(args: request)
        runOnMain {
            if let otp = request["otp"] {
                Otpless.sharedInstance.verifyOTP(otp: otp as! String, headlessRequest: headlessRequest)
            } else {
                Otpless.sharedInstance.startHeadless(headlessRequest: headlessRequest)
            }
        }
    }
    
    private func createHeadlessRequest(args: [String: Any]) -> HeadlessRequest {
        let headlessRequest = HeadlessRequest()
        if let phone = args["phone"] {
            let countryCode: String = args["countryCode"] as! String
            headlessRequest.setPhoneNumber(number: phone as! String, withCountryCode: countryCode)
        } else if let email = args["email"] {
            headlessRequest.setEmail(email as! String)
        } else if let channelType = args["channelType"] {
            headlessRequest.setChannelType(channelType as! String)
        }
        return headlessRequest
    }
    
    @objc(setWebViewInspectable:)
    func setWebViewInspectable(isInspectable: Bool) {
        Otpless.sharedInstance.webviewInspectable = isInspectable
    }
  
    @objc(enableDebugLogging:)
    func enableDebugLogging(enable: Bool) {
      if enable {
        Otpless.sharedInstance.setLoggerDelegate(delegate: self)
      }
    }
  
    @objc(showPhoneHintLib::)
    func showPhoneHintLib(showFallback: Bool, callback: RCTResponseSenderBlock) {
      let params = ["error": "Phone hint lib is not supported on iOS."]
      callback([params])
    }
    
    func onHeadlessResponse(response: HeadlessResponse?) {
        if response == nil {
            return
        }
        var params = [String: Any]()
        params["response"] = response!.responseData
        params["statusCode"] = response!.statusCode
        params["responseType"] = response!.responseType
        sendEvent(withName: "OTPlessEventResult", body: params)
    }
}

extension OtplessReactNative {
    func runOnMain(callback: @escaping (() -> Void)) {
        DispatchQueue.main.async {
            callback()
        }
    }
}

extension OtplessReactNative: OtplessLoggerDelegate {
  func otplessLog(string: String, type: String) {
    print("Otpless Log of type : \(type)\n\n\(string)")
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
                let responseData = response!.responseData!
                self.callback([responseData])
                isCallbackUsed = true
                return
            }
        }
        self.callback([params])
        isCallbackUsed = true
    }
}
