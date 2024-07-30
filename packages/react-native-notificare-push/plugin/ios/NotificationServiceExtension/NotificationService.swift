//
// Copyright (c) 2021 Notificare. All rights reserved.
//

import CoreGraphics
import Foundation
import MobileCoreServices
import UserNotifications

class NotificationService: UNNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        handleNotificationRequest(request) { result in
                switch result {
                case let .success(content):
                    contentHandler(content)

                case let .failure(error):
                    print("Failed to handle the notification request.\n\(error)")
                    contentHandler(request.content)
                }
            }
    }

    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }


    private func handleNotificationRequest(_ request: UNNotificationRequest, _ completion: @escaping (Result<UNNotificationContent, Swift.Error>) -> Void) {
        let content = request.content.mutableCopy() as! UNMutableNotificationContent

        fetchAttachment(for: request) { result in
            switch result {
            case let .success(attachment):
                if let attachment = attachment {
                    content.attachments = [attachment]
                }

                completion(.success(content))
            case let .failure(error):
                completion(.failure(error))
            }
        }
    }

    private func fetchAttachment(for request: UNNotificationRequest, _ completion: @escaping (Result<UNNotificationAttachment?, Swift.Error>) -> Void) {
        guard let attachment = request.content.userInfo["attachment"] as? [String: Any],
              let uri = attachment["uri"] as? String
        else {
            // NotificareLogger.debug("Could not find an attachment URI. Please ensure you're calling this method with the correct payload.")
            completion(.success(nil))
            return
        }

        guard let url = URL(string: uri) else {
            // NotificareLogger.warning("Invalid attachment URI. Please ensure it's a valid URL.")
            completion(.failure(Error.invalidUrl))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).map(\.path)[0]
            let fileName = url.pathComponents.last!
            let filePath = URL(fileURLWithPath: documentsPath).appendingPathComponent(fileName)

            guard let data = data, let response = response else {
                completion(.failure(Error.downloadFailed))
                return
            }

            do {
                try data.write(to: filePath, options: .atomic)
            } catch {
                completion(.failure(Error.downloadFailed))
                return
            }

            do {
                var options: [AnyHashable: Any] = [
                    UNNotificationAttachmentOptionsThumbnailClippingRectKey: CGRect(x: 0, y: 0, width: 1, height: 1),
                ]

                if let mimeType = response.mimeType,
                   let uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassMIMEType, mimeType as CFString, nil)
                {
                    options[UNNotificationAttachmentOptionsTypeHintKey] = uti.takeRetainedValue()
                }

                let attachment = try UNNotificationAttachment(identifier: "file_\(fileName)", url: filePath, options: options)
                completion(.success(attachment))
            } catch {
                completion(.failure(Error.downloadFailed))
                return
            }
        }.resume()
    }

    public enum Error: Swift.Error {
        case invalidUrl
        case downloadFailed
    }
}
