import Foundation
import NotificareUtilitiesKit

internal var logger: NotificareLogger = {
    var logger = NotificareLogger(
        subsystem: "re.notifica.push.react_native",
        category: "NotificarePush"
    )

    logger.labelIgnoreList.append("NotificarePush")

    return logger
}()
