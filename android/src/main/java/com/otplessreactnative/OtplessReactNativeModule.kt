package com.otplessreactnative

import android.app.Activity
import androidx.activity.ComponentActivity
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.otpless.dto.OtplessResponse
import com.otpless.views.OtplessManager
import org.json.JSONException
import org.json.JSONObject

/**
 * @property startOtplessWithEvent to start otpless without params, with multiple callbacks
 * @property startOtplessWithEventParams to start otpless with params, with multiple callbacks
 *
 * @property startOtplessWithCallback to start otpless without params, with single callback
 * @property startOtplessWithCallbackParams to start otpless with params, with single callback
 *
 * @property showFabButton if you want to show the fab button, after coming back to your login screen.
 * @property onSignInCompleted to be called with sign of user is completed and it hides the button.
 * */
class OtplessReactNativeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun startOtplessWithEvent() {
    OtplessManager.getInstance().start(this::sendEventCallback)
  }

  /**
   * to start otpless with parameters with multiple callbacks
   * */
  @ReactMethod
  fun startOtplessWithEventParams(data: ReadableMap) {
    val jsonObj = convertMapToJson(data) ?: return kotlin.run {
      startOtplessWithEvent()
    }
    OtplessManager.getInstance().start(this::sendEventCallback, jsonObj)
  }

  private fun sendEventCallback(result: OtplessResponse) {
    fun sendResultEvent(result: JSONObject) {
      try {
        val map = convertJsonToMap(result)
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("OTPlessSignResult", map)
      } catch (e: JSONException) {
        throw RuntimeException(e)
      }
    }

    val jsonObject = JSONObject()
    try {
      jsonObject.put("errorMessage", result.errorMessage)
      jsonObject.put("data", result.data)
    } catch (e: JSONException) {
      throw RuntimeException(e)
    }
    sendResultEvent(jsonObject)
  }

  @ReactMethod
  fun startOtplessWithCallback(callback: Callback) {
    OtplessManager.getInstance().showFabButton(false)
    OtplessManager.getInstance().start { result: OtplessResponse ->
      sendSingleCallback(callback, result)
    }
  }

  private fun sendSingleCallback(callback: Callback, result: OtplessResponse) {
    val jsonObject = JSONObject()
    try {
      jsonObject.put("errorMessage", result.errorMessage)
      jsonObject.put("data", result.data)
      val resultMap = convertJsonToMap(jsonObject)
      callback.invoke(resultMap)
    } catch (e: JSONException) {
      throw RuntimeException(e)
    }
  }

  @ReactMethod
  fun startOtplessWithCallbackParams(data: ReadableMap, callback: Callback) {
    val jsonObject = convertMapToJson(data) ?: return kotlin.run {
      startOtplessWithCallback(callback)
    }
    OtplessManager.getInstance().showFabButton(false)
    OtplessManager.getInstance().start(
      {
        sendSingleCallback(callback, it)
      }, jsonObject
    )
  }

  @ReactMethod
  fun onSignInCompleted() {
    val activity: Activity = reactContext.currentActivity ?: return
    activity.runOnUiThread { OtplessManager.getInstance().onSignInCompleted() }
  }

  @ReactMethod
  fun showFabButton(isShowFab: Boolean) {
    OtplessManager.getInstance().showFabButton(isShowFab)
  }

  companion object {
    const val NAME = "OtplessReactNative"

  }
}
