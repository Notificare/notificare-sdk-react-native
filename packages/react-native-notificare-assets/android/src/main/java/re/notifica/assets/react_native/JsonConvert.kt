package re.notifica.assets.react_native

import com.facebook.react.bridge.*
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

internal object JsonConvert {

    @Throws(JSONException::class)
    fun toJson(readableMap: ReadableMap): JSONObject {
        val jsonObject = JSONObject()
        val iterator = readableMap.keySetIterator()
        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            when (readableMap.getType(key)) {
                ReadableType.Null -> jsonObject.put(key, JSONObject.NULL)
                ReadableType.Boolean -> jsonObject.put(key, readableMap.getBoolean(key))
                ReadableType.Number -> jsonObject.put(key, readableMap.getDouble(key))
                ReadableType.String -> jsonObject.put(key, readableMap.getString(key))
                ReadableType.Map -> jsonObject.put(key, toJson(requireNotNull(readableMap.getMap(key))))
                ReadableType.Array -> jsonObject.put(key, toJson(requireNotNull(readableMap.getArray(key))))
            }
        }
        return jsonObject
    }

    @Throws(JSONException::class)
    fun toJson(readableArray: ReadableArray): JSONArray {
        val jsonArray = JSONArray()
        for (i in 0 until readableArray.size()) {
            when (readableArray.getType(i)) {
                ReadableType.Null -> jsonArray.put(JSONObject.NULL)
                ReadableType.Boolean -> jsonArray.put(readableArray.getBoolean(i))
                ReadableType.Number -> jsonArray.put(readableArray.getDouble(i))
                ReadableType.String -> jsonArray.put(readableArray.getString(i))
                ReadableType.Map -> jsonArray.put(toJson(requireNotNull(readableArray.getMap(i))))
                ReadableType.Array -> jsonArray.put(toJson(requireNotNull(readableArray.getArray(i))))
            }
        }
        return jsonArray
    }

    @Throws(JSONException::class)
    fun toReactMap(jsonObject: JSONObject): WritableMap {
        val writableMap: WritableMap = Arguments.createMap()
        val iterator: Iterator<*> = jsonObject.keys()

        while (iterator.hasNext()) {
            val key = iterator.next() as String
            val value = jsonObject[key]
            if (value is Boolean) {
                writableMap.putBoolean(key, jsonObject.getBoolean(key))
            } else if (value is Float || value is Double) {
                writableMap.putDouble(key, jsonObject.getDouble(key))
            } else if (value is Number) {
                writableMap.putInt(key, jsonObject.getInt(key))
            } else if (value is String) {
                writableMap.putString(key, jsonObject.getString(key))
            } else if (value is JSONObject) {
                writableMap.putMap(key, toReactMap(jsonObject.getJSONObject(key)))
            } else if (value is JSONArray) {
                writableMap.putArray(key, toReactMap(jsonObject.getJSONArray(key)))
            } else if (value === JSONObject.NULL) {
                writableMap.putNull(key)
            }
        }

        return writableMap
    }

    @Throws(JSONException::class)
    fun toReactMap(jsonArray: JSONArray): WritableArray {
        val writableArray: WritableArray = Arguments.createArray()

        for (i in 0 until jsonArray.length()) {
            when (jsonArray[i]) {
                is Boolean -> writableArray.pushBoolean(jsonArray.getBoolean(i))
                is Float, is Double -> writableArray.pushDouble(jsonArray.getDouble(i))
                is Number -> writableArray.pushInt(jsonArray.getInt(i))
                is String -> writableArray.pushString(jsonArray.getString(i))
                is JSONObject -> writableArray.pushMap(toReactMap(jsonArray.getJSONObject(i)))
                is JSONArray -> writableArray.pushArray(toReactMap(jsonArray.getJSONArray(i)))
                JSONObject.NULL -> writableArray.pushNull()
            }
        }

        return writableArray
    }
}

internal fun JSONObject.toReactMap(): WritableMap {
    return JsonConvert.toReactMap(this)
}

internal fun ReadableMap.toJson(): JSONObject {
    return JsonConvert.toJson(this)
}
