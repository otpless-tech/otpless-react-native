//
//  Connector.swift
//  OtplessReactNativeExample
//
//  Created by Digvijay Singh on 06/07/23.
//

import Foundation
import OtplessSDK


class Connector: NSObject {
  
  @objc public static func loadUrl(_ url: URL) -> Bool {
    if Otpless.sharedInstance.isOtplessDeeplink(url: url) {
      Otpless.sharedInstance.processOtplessDeeplink(url: url)
      return true;
    }
    return false;
   }
}
