import Foundation
import NotificareUtilitiesKit

internal var logger: NotificareLogger = {
    var logger = NotificareLogger(
        subsystem: "re.notifica.iam.react_native",
        category: "NotificareInAppMessaging"
    )

    logger.labelIgnoreList.append("NotificareInAppMessaging")

    return logger
}()
