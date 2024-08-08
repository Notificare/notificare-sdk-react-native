package re.notifica.geo.react_native

import android.content.ContentProvider
import android.content.ContentValues
import android.database.Cursor
import android.net.Uri
import re.notifica.Notificare
import re.notifica.geo.ktx.geo

internal class NotificareGeoModuleProvider : ContentProvider() {
    override fun onCreate(): Boolean {
        Notificare.geo().intentReceiver = NotificareGeoModuleIntentReceiver::class.java

        return true
    }

    override fun query(
        p0: Uri,
        p1: Array<out String>?,
        p2: String?,
        p3: Array<out String>?,
        p4: String?
    ): Cursor? = null

    override fun getType(uri: Uri): String? = null

    override fun insert(uri: Uri, values: ContentValues?): Uri? = null

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int = 0

    override fun update(
        uri: Uri,
        values: ContentValues?,
        selection: String?,
        selectionArgs: Array<String>?
    ): Int = 0
}
