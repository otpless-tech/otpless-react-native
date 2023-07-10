//
//  Connector.swift
//  OtplessReactNativeExample
//
//  Created by Digvijay Singh on 06/07/23.
//

import Foundation
import OtplessSDK


class Connector: NSObject {
  @objc static func callOtpless(_ link: URL) {
    Otpless.sharedInstance.processOtplessDeeplink(url: link)
  }
}
