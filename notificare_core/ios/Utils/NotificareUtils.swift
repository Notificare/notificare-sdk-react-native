import Foundation

class NotificareUtils {

    static let DEFAULT_ERROR = "notificare_error"

    static let dateFormatter: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.timeZone = TimeZone(identifier: "UTC")

        return formatter
    }()
}
