package com.otplessreactnative

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject


internal fun convertMapToJson(map: ReadableMap?): JSONObject? {
  map ?: return null
  try {
    val resultJson = JSONObject()
    val iterator = map.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey() ?: continue
      when (map.getType(key)) {
        ReadableType.Null -> continue
        ReadableType.Boolean -> resultJson.put(key, map.getBoolean(key))
        ReadableType.String -> resultJson.put(key, map.getString(key))
        ReadableType.Number -> resultJson.put(key, map.getDouble(key))
        ReadableType.Map -> {
          val innerMap = convertMapToJson(map.getMap(key)) ?: continue
          resultJson.put(key, innerMap)
        }

        ReadableType.Array -> {
          val array = map.getArray(key) ?: continue
          resultJson.put(key, convertArrayToJson(array))
        }
      }
    }
    return resultJson
  } catch (ex: Exception) {
    return null
  }
}

internal fun convertArrayToJson(array: ReadableArray?): JSONArray? {
  array ?: return null
  try {
    val resultArray = JSONArray()
    var index = 0
    while (index < array.size()) {
      when (array.getType(index)) {
        ReadableType.Null -> continue
        ReadableType.Boolean -> resultArray.put(array.getBoolean(index))
        ReadableType.String -> resultArray.put(array.getString(index))
        ReadableType.Number -> resultArray.put(array.getDouble(index))
        ReadableType.Map -> {
          val innerMap = convertMapToJson(array.getMap(index)) ?: continue
          resultArray.put(innerMap)
        }

        ReadableType.Array -> {
          val innerArray = convertArrayToJson(array.getArray(index)) ?: continue
          resultArray.put(innerArray)
        }
      }
      index++
    }
    return resultArray
  } catch (ex: Exception) {
    return null
  }
}

@Throws(JSONException::class)
internal fun convertJsonToMap(jsonObject: JSONObject): WritableMap {
  val map: WritableMap = WritableNativeMap()
  val iterator = jsonObject.keys()
  while (iterator.hasNext()) {
    val key = iterator.next()
    val value = jsonObject[key]
    if (value is JSONObject) {
      map.putMap(key, convertJsonToMap(value))
    } else if (value is JSONArray) {
      map.putArray(key, convertJsonToArray(value))
    } else if (value is Boolean) {
      map.putBoolean(key, value)
    } else if (value is Int) {
      map.putInt(key, value)
    } else if (value is Double) {
      map.putDouble(key, value)
    } else if (value is String) {
      map.putString(key, value)
    } else {
      map.putString(key, value.toString())
    }
  }
  return map
}

@Throws(JSONException::class)
internal fun convertJsonToArray(jsonArray: JSONArray): WritableArray {
  val array: WritableArray = WritableNativeArray()
  for (i in 0 until jsonArray.length()) {
    val value = jsonArray[i]
    if (value is JSONObject) {
      array.pushMap(convertJsonToMap(value))
    } else if (value is JSONArray) {
      array.pushArray(convertJsonToArray(value))
    } else if (value is Boolean) {
      array.pushBoolean(value)
    } else if (value is Int) {
      array.pushInt(value)
    } else if (value is Double) {
      array.pushDouble(value)
    } else if (value is String) {
      array.pushString(value)
    } else {
      array.pushString(value.toString())
    }
  }
  return array
}
