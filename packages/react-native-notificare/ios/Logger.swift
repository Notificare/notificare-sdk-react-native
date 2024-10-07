import Foundation
import NotificareUtilitiesKit

internal var logger: NotificareLogger = {
    var logger = NotificareLogger(
        subsystem: "re.notifica.react_native",
        category: "Notificare"
    )

    logger.labelIgnoreList.append("Notificare")

    return logger
}()
