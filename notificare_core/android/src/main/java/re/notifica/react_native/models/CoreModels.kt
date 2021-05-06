package re.notifica.react_native.models

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import re.notifica.models.*
import re.notifica.react_native.NotificarePackage
import java.util.*

internal fun NotificareDevice.toWritableMap(): WritableMap {
    val map = Arguments.createMap()
    map.putString("id", id)
    map.putString("userId", userId)
    map.putString("userName", userName)
    map.putDouble("timeZoneOffset", timeZoneOffset.toDouble())
    map.putString("osVersion", osVersion)
    map.putString("sdkVersion", sdkVersion)
    map.putString("appVersion", appVersion)
    map.putString("deviceString", deviceString)
    map.putString("language", language)
    map.putString("region", region)
    map.putString("transport", NotificarePackage.moshi.adapter(NotificareTransport::class.java).toJsonValue(transport) as? String?)
    dnd?.let { map.putMap("dnd", it.toWritableMap()) }
    userData?.let { map.putMap("userData", it.toWritableMap()) }
    map.putString("lastRegistered", NotificarePackage.moshi.adapter(Date::class.java).toJsonValue(lastRegistered) as? String)
    return map
}

internal fun NotificareUserData.toWritableMap(): WritableMap {
    return Arguments.createMap().apply {
        this@toWritableMap.forEach { (key, value) -> putString(key, value) }
    }
}

internal fun NotificareDoNotDisturb.toWritableMap(): WritableMap {
    val map = Arguments.createMap()
    map.putString("start", start.format())
    map.putString("end", end.format())
    return map
}

internal fun NotificareDoNotDisturb(json: ReadableMap): NotificareDoNotDisturb {
    return NotificareDoNotDisturb(
        start = NotificareTime(requireNotNull(json.getString("start"))),
        end = NotificareTime(requireNotNull(json.getString("end"))),
    )
}
