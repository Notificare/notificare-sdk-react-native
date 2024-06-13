import React
import NotificareKit
import NotificarePushUIKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc public protocol NotificarePushUIModuleDelegate {
    func broadcastEvent(name: String, body: Any?)
}

@objc(NotificarePushUIModuleImpl)
public class NotificarePushUIModuleImpl: NSObject {
    @objc public weak var delegate: NotificarePushUIModuleDelegate? = nil

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    override public init() {
        super.init()

        Notificare.shared.pushUI().delegate = self
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
            "re.notifica.push.ui.notification_will_present",
            "re.notifica.push.ui.notification_presented",
            "re.notifica.push.ui.notification_finished_presenting",
            "re.notifica.push.ui.notification_failed_to_present",
            "re.notifica.push.ui.notification_url_clicked",
            "re.notifica.push.ui.action_will_execute",
            "re.notifica.push.ui.action_executed",
            "re.notifica.push.ui.action_not_executed",
            "re.notifica.push.ui.action_failed_to_execute",
            "re.notifica.push.ui.custom_action_received",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            delegate?.broadcastEvent(name: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    private var rootViewController: UIViewController? {
        get {
            UIApplication.shared.delegate?.window??.rootViewController
        }
    }

    // MARK: - Notificare Push

    @objc
    public func presentNotification(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let notification: NotificareNotification

        do {
            notification = try NotificareNotification.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        onMainThread {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot present a notification with a nil root view controller.", nil)
                return
            }

            if notification.requiresViewController {
                let navigationController = self.createNavigationController()
                rootViewController.present(navigationController, animated: true) {
                    Notificare.shared.pushUI().presentNotification(notification, in: navigationController)
                    resolve(nil)
                }
            } else {
                Notificare.shared.pushUI().presentNotification(notification, in: rootViewController)
                resolve(nil)
            }
        }
    }

    @objc
    public func presentAction(_ notificationData: [String: Any], action actionData: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let notification: NotificareNotification
        let action: NotificareNotification.Action

        do {
            notification = try NotificareNotification.fromJson(json: notificationData)
            action = try NotificareNotification.Action.fromJson(json: actionData)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        onMainThread {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot present a notification action with a nil root view controller.", nil)
                return
            }

            Notificare.shared.pushUI().presentAction(action, for: notification, in: rootViewController)
            resolve(nil)
        }
    }

    private func createNavigationController() -> UINavigationController {
        let navigationController = UINavigationController()
        let theme = Notificare.shared.options?.theme(for: navigationController)

        if let colorStr = theme?.backgroundColor {
            navigationController.view.backgroundColor = UIColor(hexString: colorStr)
        } else {
            if #available(iOS 13.0, *) {
                navigationController.view.backgroundColor = .systemBackground
            } else {
                navigationController.view.backgroundColor = .white
            }
        }

        return navigationController
    }

    @objc private func onCloseClicked() {
        guard let rootViewController = rootViewController else {
            return
        }

        rootViewController.dismiss(animated: true, completion: nil)
    }
}

extension NotificareNotification {
    var requiresViewController: Bool {
        get {
            if let type = NotificareNotification.NotificationType.init(rawValue: type) {
                switch type {
                case .none, .alert, .passbook, .rate, .urlScheme:
                    return false
                default:
                    break
                }
            }

            return true
        }
    }
}

extension NotificarePushUIModuleImpl: NotificarePushUIDelegate {
    public func notificare(_ notificarePushUI: NotificarePushUI, willPresentNotification notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.ui.notification_will_present", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.notification_will_present event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, didPresentNotification notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.ui.notification_presented", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.notification_presented event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, didFinishPresentingNotification notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.ui.notification_finished_presenting", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.notification_finished_presenting event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, didFailToPresentNotification notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.ui.notification_failed_to_present", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.notification_failed_to_present event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, didClickURL url: URL, in notification: NotificareNotification) {
        do {
            let payload: [String: Any] = [
                "notification": try notification.toJson(),
                "url": url.absoluteString,
            ]

            dispatchEvent("re.notifica.push.ui.notification_url_clicked", payload: payload)
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.notification_url_clicked event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, willExecuteAction action: NotificareNotification.Action, for notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.ui.action_will_execute", payload: [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ])
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.action_will_execute event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, didExecuteAction action: NotificareNotification.Action, for notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.ui.action_executed", payload: [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ])
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.action_executed event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, didNotExecuteAction action: NotificareNotification.Action, for notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.ui.action_not_executed", payload: [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ])
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.action_not_executed event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, didFailToExecuteAction action: NotificareNotification.Action, for notification: NotificareNotification, error: Error?) {
        do {
            var payload: [String: Any] = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ]

            if let error = error {
                payload["error"] = error.localizedDescription
            }

            dispatchEvent("re.notifica.push.ui.action_failed_to_execute", payload: payload)
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.action_failed_to_execute event.", error: error)
        }
    }

    public func notificare(_ notificarePushUI: NotificarePushUI, didReceiveCustomAction url: URL, in action: NotificareNotification.Action, for notification: NotificareNotification) {
        do {
            let payload: [String: Any] = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
                "url": url.absoluteString,
            ]

            dispatchEvent("re.notifica.push.ui.custom_action_received", payload: payload)
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.ui.custom_action_received event.", error: error)
        }
    }
}

private func onMainThread(_ action: @escaping () -> Void) {
    DispatchQueue.main.async {
        action()
    }
}
