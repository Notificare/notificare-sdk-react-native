import Foundation
import NotificareUtilitiesKit

internal var logger: NotificareLogger = {
    var logger = NotificareLogger(
        subsystem: "re.notifica.push.ui.react_native",
        category: "NotificarePushUI"
    )

    logger.labelIgnoreList.append("NotificarePushUI")

    return logger
}()
