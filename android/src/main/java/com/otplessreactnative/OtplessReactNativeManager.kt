package com.otplessreactnative

import androidx.activity.ComponentActivity
import com.otpless.views.OtplessManager

object OtplessReactNativeManager {
  fun initOtpless(activity: ComponentActivity) {
    OtplessManager.getInstance().init(activity)
  }
}
