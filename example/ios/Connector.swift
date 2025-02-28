//
//  Connector.swift
//  OtplessReactNativeExample
//
//  Created by Digvijay Singh on 06/07/23.
//

import OtplessSDK
import Foundation

class Connector: NSObject {
  @objc public static func loadUrl(_ url: NSURL) {
  Otpless.sharedInstance.processOtplessDeeplink(url: url as URL)
  }
  @objc public static func isOtplessDeeplink(_ url: NSURL) -> Bool {
  return Otpless.sharedInstance.isOtplessDeeplink(url: url as URL)
  }
  
  @objc public static func registerFBApp(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
    Otpless.sharedInstance.registerFBApp(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  @objc public static func registerFBApp(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) {
    Otpless.sharedInstance.registerFBApp(app, open: url, options: options)
  }
  
  @available(iOS 13.0, *)
  @objc public static func registerFBApp(
    openURLContexts URLContexts: Set<UIOpenURLContext>
  ) {
    Otpless.sharedInstance.registerFBApp(openURLContexts: URLContexts)
  }
}
