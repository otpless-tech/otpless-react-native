package com.otplessreactnative

import android.app.Activity
import com.otpless.main.OtplessManager
import com.otpless.main.OtplessView
import java.lang.ref.WeakReference

object OtplessReactNativeManager {

  private var wModule: WeakReference<OtplessReactNativeModule>? = null
  internal var wOtplessView : WeakReference<OtplessView?> = WeakReference(null)

  internal fun registerOtplessModule(otplessModule: OtplessReactNativeModule) {
    wModule = WeakReference(otplessModule)
  }

  fun onBackPressed(): Boolean {
    return wModule?.get()?.otplessView?.onBackPressed() ?: false
  }

  fun registerOtplessView(activity: Activity) {
    wOtplessView = WeakReference(OtplessManager.getInstance().getOtplessView(activity))
  }
}
