import NotificareKit
import NotificarePushUIKit
import React
import UIKit

fileprivate let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificarePushUIModule)
class NotificarePushUIModule: RCTEventEmitter {

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()
    
    override init() {
        super.init()
        
        NotificarePushUI.shared.delegate = self
    }
    
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func startObserving() {
        hasListeners = true
        
        if !eventQueue.isEmpty {
            NotificareLogger.debug("Processing event queue with \(eventQueue.count) items.")
            eventQueue.forEach { sendEvent(withName: $0.name, body: $0.payload)}
            eventQueue.removeAll()
        }
    }
    
    override func stopObserving() {
        hasListeners = false
    }
    
    override func supportedEvents() -> [String] {
        return [
            // TODO add Push UI lifecycle events
        ]
    }
    
    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            sendEvent(withName: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }
    
    // MARK: - Notificare Push UI
    
    @objc
    func presentNotification(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let notification: NotificareNotification
        
        do {
            notification = try NotificareNotification.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        onMainThread {
            guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot present a notification with a nil root view controller.", nil)
                return
            }
            
            if notification.requiresViewController {
                let navigationController = self.createNavigationController()
                rootViewController.present(navigationController, animated: true) {
                    NotificarePushUI.shared.presentNotification(notification, in: navigationController)
                    resolve(nil)
                }
            } else {
                NotificarePushUI.shared.presentNotification(notification, in: rootViewController)
                resolve(nil)
            }
        }
    }
    
    @objc
    func presentAction(_ notificationData: [String: Any], action actionData: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
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
            guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot present a notification action with a nil root view controller.", nil)
                return
            }
            
            NotificarePushUI.shared.presentAction(action, for: notification, in: rootViewController)
            resolve(nil)
        }
    }
    
    private func createNavigationController() -> UINavigationController {
        let navigationController = UINavigationController()
        let theme = Notificare.shared.options?.theme(for: navigationController)
        
        if let colorStr = theme?.backgroundColor {
            navigationController.view.backgroundColor = UIColor(hexString: colorStr)
        } else {
            navigationController.view.backgroundColor = .white
        }
        
        let closeButton: UIBarButtonItem
        if let closeButtonImage = NotificareLocalizable.image(resource: .close) {
            closeButton = UIBarButtonItem(image: closeButtonImage,
                                          style: .plain,
                                          target: self,
                                          action: #selector(onCloseClicked))
        } else {
            closeButton = UIBarButtonItem(title: NotificareLocalizable.string(resource: .closeButton),
                                          style: .plain,
                                          target: self,
                                          action: #selector(onCloseClicked))
        }
        
        if let colorStr = theme?.actionButtonTextColor {
            closeButton.tintColor = UIColor(hexString: colorStr)
        }
        
        navigationController.navigationItem.leftBarButtonItem = closeButton
        
        return navigationController
    }

    @objc private func onCloseClicked() {
        guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
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
                case .alert, .none, .passbook, .rate, .urlScheme:
                    return false
                default:
                    break
                }
            }
            
            return true
        }
    }
}

extension NotificarePushUIModule: NotificarePushUIDelegate {
    
}

fileprivate func onMainThread(_ action: @escaping () -> Void) {
    DispatchQueue.main.async {
        action()
    }
}
