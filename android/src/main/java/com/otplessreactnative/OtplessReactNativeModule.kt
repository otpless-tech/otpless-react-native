package com.otplessreactnative

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.otpless.dto.HeadlessRequest
import com.otpless.dto.HeadlessResponse
import com.otpless.dto.OtplessRequest
import com.otpless.dto.OtplessResponse
import com.otpless.main.OtplessManager
import com.otpless.main.OtplessView
import com.otpless.utils.Utility
import org.json.JSONException
import org.json.JSONObject

/**
 * @property showOtplessLoginPage to show otpless login page without params
 * @property setLoaderVisibility to make native side loader visible and invisible
 * @property isWhatsappInstalled to check if whatsapp is installed in app or not
 * */
class OtplessReactNativeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {

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
    reactContext.addActivityEventListener(this)
  }

  override fun getName(): String {
    return NAME
  }

  private fun sendHeadlessEventCallback(result: HeadlessResponse) {
    fun sendResultEvent(result: JSONObject) {
      try {
        val map = convertJsonToMap(result)
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("OTPlessEventResult", map)
      } catch (e: JSONException) {
        throw RuntimeException(e)
      }
    }

    val jsonObject = JSONObject()
    try {
      jsonObject.put("responseType", result.responseType)
      jsonObject.put("response", result.response)
      jsonObject.put("statusCode", result.statusCode)
    } catch (e: JSONException) {
      throw RuntimeException(e)
    }
    sendResultEvent(jsonObject)
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
  fun showOtplessLoginPage(data: ReadableMap, callback: Callback) {
    val appId = data.getString("appId")!!
    val request = OtplessRequest(appId)
    data.getMap("params")?.let { params ->
      params.getString("uxmode")?.let { uxmode ->
        request.setUxmode(uxmode)
      }
      params.getString("locale")?.let { locale ->
        request.setUxmode(locale)
      }
      val iterator = params.keySetIterator()
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey() ?: break
        val value = params.getString(key) ?: continue
        request.addExtras(key, value)
      }
    }
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.showOtplessLoginPage(request) { result: OtplessResponse ->
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

  @ReactMethod
  fun setLoaderVisibility(isVisible: Boolean) {
    otplessView!!.setLoaderVisibility(isVisible)
  }

  @ReactMethod
  fun initHeadless(appId: String) {
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.initHeadless(appId)
    }
  }

  @ReactMethod
  fun startHeadless(data: ReadableMap) {
    val headlessRequest = HeadlessRequest()
    val phone = data.getString("phone") ?: ""
    // phone number authentication
    if (phone.isNotEmpty()) {
      val countryCode = data.getString("countryCode") ?: ""
      headlessRequest.setPhoneNumber(countryCode, phone)
      data.getString("otp")?.let {
        headlessRequest.setOtp(it)
      }
    } else {
      // email authentication
      val email = data.getString("email") ?: ""
      if (email.isNotEmpty()) {
        headlessRequest.setEmail(email)
        data.getString("otp")?.let {
          headlessRequest.setOtp(it)
        }
      } else {
        // oauth case
        headlessRequest.setChannelType(data.getString("channelType") ?: "")
      }
    }
    reactContext.currentActivity!!.runOnUiThread {
      otplessView!!.startHeadless(headlessRequest, this::sendHeadlessEventCallback)
    }
  }

  @ReactMethod
  fun setHeadlessCallback() {
    otplessView!!.setHeadlessCallback(this::sendHeadlessEventCallback)
  }

  @ReactMethod
  fun setWebViewInspectable(isInspectable: Boolean) {
    // empty method implementation for ios
  }

  @ReactMethod
  fun enableDebugLogging(isEnabled: Boolean) {
    Utility.debugLogging = isEnabled
  }

  @ReactMethod
  fun showPhoneHintLib(showFallback: Boolean, callback: Callback) {
    otplessView!!.phoneHintManager.showPhoneNumberHint(showFallback) { phoneHintResult ->
      val jsonObject = JSONObject().apply {
        if (phoneHintResult.first != null)
          "phoneNumber" to phoneHintResult.first!!
        else
          "error" to phoneHintResult.second!!.message!!
      }
      callback.invoke(convertJsonToMap(jsonObject))
    }
  }

  companion object {
    const val NAME = "OtplessReactNative"
  }

  override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
    otplessView?.onActivityResult(requestCode, resultCode, data)
  }

  override fun onNewIntent(intent: Intent?) {
    intent ?: return
    otplessView?.onNewIntent(intent)
  }
}
