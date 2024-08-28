package com.otplessreactnative

import android.content.Intent
import java.lang.ref.WeakReference

object OtplessReactNativeManager {

  private var wModule: WeakReference<OtplessReactNativeModule>? = null

  internal fun registerOtplessModule(otplessModule: OtplessReactNativeModule) {
    wModule = WeakReference(otplessModule)
  }

  fun onBackPressed(): Boolean {
    return wModule?.get()?.otplessView?.onBackPressed() ?: false
  }
}
