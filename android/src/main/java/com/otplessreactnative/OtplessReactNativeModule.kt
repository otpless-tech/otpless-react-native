package com.otplessreactnative

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.otpless.dto.OtplessResponse
import com.otpless.main.OtplessManager
import com.otpless.main.OtplessView
import com.otpless.utils.Utility
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
 *
 * @property showOtplessLoginPage to show otpless login page without params
 * @property showOtplessLoginPageWithParams to show otpless login page with params
 * */
class OtplessReactNativeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private var _otplessView: OtplessView? = null

  @get:Synchronized
  internal val otplessView: OtplessView?
    get() {
      if (_otplessView == null) {
        if (currentActivity == null) return null
        _otplessView = OtplessManager.getInstance().getOtplessView(currentActivity)
      }
      return _otplessView
    }

  init {
    OtplessReactNativeManager.registerOtplessModule(this)
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun startOtplessWithEvent() {
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.setCallback(this::sendEventCallback, null)
      otplessView!!.startOtpless()
    }
  }

  /**
   * to start otpless with parameters with multiple callbacks
   * */
  @ReactMethod
  fun startOtplessWithEventParams(data: ReadableMap) {
    val jsonObj = convertMapToJson(data) ?: return kotlin.run {
      startOtplessWithEvent()
    }
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.startOtpless(jsonObj, this::sendEventCallback)
    }
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
    otplessView!!.showOtplessFab(false)
    otplessView!!.setCallback({ result: OtplessResponse ->
      sendSingleCallback(callback, result)
    }, null)
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.startOtpless()
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
    otplessView!!.showOtplessFab(false)
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.startOtpless(jsonObject, this::sendEventCallback)
    }
  }

  @ReactMethod
  fun onSignInCompleted() {
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.onSignInCompleted()
    }
  }

  @ReactMethod
  fun showFabButton(isShowFab: Boolean) {
    otplessView!!.showOtplessFab(isShowFab)
  }

  @ReactMethod
  fun showOtplessLoginPage(data: ReadableMap?, callback: Callback) {
    val jsonObject = convertMapToJson(data)
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.showOtplessLoginPage(jsonObject) { result: OtplessResponse ->
        sendSingleCallback(callback, result)
      }
    }
  }

  @ReactMethod
  fun isWhatsappInstalled(callback: Callback) {
    val hasWhatsapp = Utility.isWhatsAppInstalled(reactContext)
    val json = JSONObject().also {
      it.put("hasWhatsapp", hasWhatsapp)
    }
    callback.invoke(convertJsonToMap(json))
  }

  companion object {
    const val NAME = "OtplessReactNative"
  }
}
