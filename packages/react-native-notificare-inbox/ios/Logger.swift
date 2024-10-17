import Foundation
import NotificareUtilitiesKit

internal var logger: NotificareLogger = {
    var logger = NotificareLogger(
        subsystem: "re.notifica.inbox.react_native",
        category: "NotificareInbox"
    )

    logger.labelIgnoreList.append("NotificareInbox")

    return logger
}()
