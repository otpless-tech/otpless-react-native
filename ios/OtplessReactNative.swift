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
        // Added event for "otpless_sim_status_change_event" to prevent runtime warning in iOS.
        return ["OTPlessEventResult", "otpless_sim_status_change_event"]
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
          let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
          if rootViewController != nil {
            Otpless.sharedInstance.initialise(vc: rootViewController!, appId: appId)
            return
          }
          
          // Could not get an instance of RootViewController. Try to get RootViewController from `windowScene`.
          if #available(iOS 13.0, *) {
            let windowSceneVC = self.getRootViewControllerFromWindowScene()
            if windowSceneVC != nil {
              Otpless.sharedInstance.initialise(vc: windowSceneVC!, appId: appId)
              return
            }
          }
          
          // Could not get an instance of ViewController, send error response
          self.onHeadlessResponse(response: HeadlessResponse(responseType: "INITIATE", responseData: ["errorCode": "5309", "errorMessage": "Could not find an instance of UIViewController to attach OtplessView."], statusCode: 500))
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
        
        if let deliveryChannel = args["deliveryChannel"] as? String {
          headlessRequest.setDeliveryChannel(deliveryChannel)
        }
        if let otpExpiry = args["expiry"] as? String {
          headlessRequest.setExpiry(expiry: otpExpiry)
        }
        if let otpLength = args["otpLength"] as? String {
          headlessRequest.setOtpLength(otpLength: otpLength)
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
  
    @objc(showPhoneHintLib:withCallback:)
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
  
  @objc
  func setSimEjectionListener(_ isToAttach: Bool) {
      // Not supported in iOS.
  }

  @objc(getEjectedSimsEntries:rejecter:)
    func getEjectedSimsEntries(promise: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    reject("SIM_ERROR", "Sim entries not available on iOS.", nil)
  }
  
  @objc(attachSecureSDK:promise:rejecter:)
  func attachSecureSDK(appId: String, promise: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    reject("SERVICE_ERROR", "Secure SDK is not supported on iOS.", nil)
  }
  
  @available(iOS 13.0, *)
  private func getRootViewControllerFromWindowScene() -> UIViewController? {
    guard let windowScene = UIApplication.shared.connectedScenes
            .filter({ $0.activationState == .foregroundActive })
            .first as? UIWindowScene else {
        return nil
    }

    if #available(iOS 15.0, *) {
      let keyWindowVC = windowScene.windows.first?.windowScene?.keyWindow?.rootViewController
      if keyWindowVC != nil {
        return keyWindowVC
      }
    }
    
    return windowScene.windows.first?.rootViewController
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
