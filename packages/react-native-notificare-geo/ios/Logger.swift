import Foundation
import NotificareUtilitiesKit

internal var logger: NotificareLogger = {
    var logger = NotificareLogger(
        subsystem: "re.notifica.geo.react_native",
        category: "NotificareGeo"
    )

    logger.labelIgnoreList.append("NotificareGeo")

    return logger
}()
