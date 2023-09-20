package com.otplessreactnative

import android.content.Intent
import java.lang.ref.WeakReference

object OtplessReactNativeManager {

  private var wModule: WeakReference<OtplessReactNativeModule>? = null

  internal fun registerOtplessModule(otplessModule: OtplessReactNativeModule) {
    wModule = WeakReference(otplessModule)
  }

  fun onNewIntent(intent: Intent?) {
    wModule?.get()?.otplessView?.verifyIntent(intent)
  }

  fun onBackPressed(): Boolean {
    return wModule?.get()?.otplessView?.onBackPressed() ?: false
  }
}
