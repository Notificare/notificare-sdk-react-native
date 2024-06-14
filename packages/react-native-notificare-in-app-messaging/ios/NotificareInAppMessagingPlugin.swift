import React
import NotificareKit
import NotificareInAppMessagingKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc public protocol NotificareInAppMessagingModuleDelegate {
    func broadcastEvent(name: String, body: Any?)
}

@objc(NotificareInAppMessagingPlugin)
public class NotificareInAppMessagingPlugin: NSObject {
    @objc public weak var delegate: NotificareInAppMessagingModuleDelegate? = nil

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    override public init() {
        super.init()

        Notificare.shared.inAppMessaging().delegate = self
    }

    @objc
    public func startObserving() {
        hasListeners = true

        if !eventQueue.isEmpty {
            NotificareLogger.debug("Processing event queue with \(eventQueue.count) items.")
            eventQueue.forEach { delegate?.broadcastEvent(name: $0.name, body: $0.payload)}
            eventQueue.removeAll()
        }
    }

    @objc
    public func stopObserving() {
        hasListeners = false
    }

    @objc
    public func supportedEvents() -> [String] {
        return [
            "re.notifica.iam.message_presented",
            "re.notifica.iam.message_finished_presenting",
            "re.notifica.iam.message_failed_to_present",
            "re.notifica.iam.action_executed",
            "re.notifica.iam.action_failed_to_execute",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            delegate?.broadcastEvent(name: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    // MARK: - Notificare In-App Messaging

    @objc
    public func hasMessagesSuppressed(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.inAppMessaging().hasMessagesSuppressed)
    }

    @objc
    public func setMessagesSuppressed(_ data: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        guard let suppressed = data["suppressed"] as? Bool else {
            reject(DEFAULT_ERROR_CODE, "Missing 'suppressed' parameter.", nil)
            return
        }

        let evaluateContext = data["evaluateContext"] as? Bool ?? false

        Notificare.shared.inAppMessaging().setMessagesSuppressed(suppressed, evaluateContext: evaluateContext)

        resolve(nil)
    }
}

extension NotificareInAppMessagingPlugin: NotificareInAppMessagingDelegate {
    public func notificare(_ notificare: NotificareInAppMessaging, didPresentMessage message: NotificareInAppMessage) {
        do {
            dispatchEvent("re.notifica.iam.message_presented", payload: try message.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.iam.message_presented event.", error: error)
        }
    }

    public func notificare(_ notificare: NotificareInAppMessaging, didFinishPresentingMessage message: NotificareInAppMessage) {
        do {
            dispatchEvent("re.notifica.iam.message_finished_presenting", payload: try message.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.iam.message_finished_presenting event.", error: error)
        }
    }

    public func notificare(_ notificare: NotificareInAppMessaging, didFailToPresentMessage message: NotificareInAppMessage) {
        do {
            dispatchEvent("re.notifica.iam.message_failed_to_present", payload: try message.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.iam.message_failed_to_present event.", error: error)
        }
    }

    public func notificare(_ notificare: NotificareInAppMessaging, didExecuteAction action: NotificareInAppMessage.Action, for message: NotificareInAppMessage) {
        do {
            dispatchEvent("re.notifica.iam.action_executed", payload: [
                "message": try message.toJson(),
                "action": try action.toJson(),
            ])
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.iam.action_executed event.", error: error)
        }
    }

    public func notificare(_ notificare: NotificareInAppMessaging, didFailToExecuteAction action: NotificareInAppMessage.Action, for message: NotificareInAppMessage, error: Error?) {
        do {
            var payload: [String: Any] = [
                "message": try message.toJson(),
                "action": try action.toJson(),
            ]

            if let error = error {
                payload["error"] = error.localizedDescription
            }

            dispatchEvent("re.notifica.iam.action_failed_to_execute", payload: payload)
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.iam.action_failed_to_execute event.", error: error)
        }
    }
}
