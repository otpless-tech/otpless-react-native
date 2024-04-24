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
}
