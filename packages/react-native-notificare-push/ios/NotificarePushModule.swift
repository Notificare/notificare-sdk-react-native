import React
import NotificareKit
import NotificarePushKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificarePushModule)
class NotificarePushModule: RCTEventEmitter {
    
    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()
    
    override init() {
        super.init()
        
        Notificare.shared.push().delegate = self
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
            "re.notifica.push.notification_received",
            "re.notifica.push.system_notification_received",
            "re.notifica.push.unknown_notification_received",
            "re.notifica.push.notification_opened",
            "re.notifica.push.unknown_notification_opened",
            "re.notifica.push.notification_action_opened",
            "re.notifica.push.unknown_notification_action_opened",
            "re.notifica.push.notification_settings_changed",
            "re.notifica.push.should_open_notification_settings",
            "re.notifica.push.failed_to_register_for_remote_notifications",
        ]
    }
    
    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            sendEvent(withName: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }
    
    // MARK: - Notificare Push
    
    @objc
    func setAuthorizationOptions(_ options: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        var authorizationOptions: UNAuthorizationOptions = []
        
        options.forEach { option in
            if option == "alert" {
                authorizationOptions = [authorizationOptions, .alert]
            }
            
            if option == "badge" {
                authorizationOptions = [authorizationOptions, .badge]
            }
            
            if option == "sound" {
                authorizationOptions = [authorizationOptions, .sound]
            }
            
            if option == "carPlay" {
                authorizationOptions = [authorizationOptions, .carPlay]
            }
            
            if #available(iOS 12.0, *) {
                if option == "providesAppNotificationSettings" {
                    authorizationOptions = [authorizationOptions, .providesAppNotificationSettings]
                }
                
                if option == "provisional" {
                    authorizationOptions = [authorizationOptions, .provisional]
                }
                
                if option == "criticalAlert" {
                    authorizationOptions = [authorizationOptions, .criticalAlert]
                }
            }
            
            if #available(iOS 13.0, *) {
                if option == "announcement" {
                    authorizationOptions = [authorizationOptions, .announcement]
                }
            }
        }
        
        Notificare.shared.push().authorizationOptions = authorizationOptions
        resolve(nil)
    }
    
    @objc
    func setCategoryOptions(_ options: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        var categoryOptions: UNNotificationCategoryOptions = []
        
        options.forEach { option in
            if option == "customDismissAction" {
                categoryOptions = [categoryOptions, .customDismissAction]
            }
            
            if option == "allowInCarPlay" {
                categoryOptions = [categoryOptions, .allowInCarPlay]
            }
            
            if #available(iOS 11.0, *) {
                if option == "hiddenPreviewsShowTitle" {
                    categoryOptions = [categoryOptions, .hiddenPreviewsShowTitle]
                }
                
                if option == "hiddenPreviewsShowSubtitle" {
                    categoryOptions = [categoryOptions, .hiddenPreviewsShowSubtitle]
                }
            }
            
            if #available(iOS 13.0, *) {
                if option == "allowAnnouncement" {
                    categoryOptions = [categoryOptions, .allowAnnouncement]
                }
            }
        }
        
        Notificare.shared.push().categoryOptions = categoryOptions
        resolve(nil)
    }
    
    @objc
    func setPresentationOptions(_ options: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        var presentationOptions: UNNotificationPresentationOptions = []
        
        options.forEach { option in
            if #available(iOS 14.0, *) {
                if option == "banner" || option == "alert" {
                    presentationOptions = [presentationOptions, .banner]
                }
                
                if option == "list" {
                    presentationOptions = [presentationOptions, .list]
                }
            } else {
                if option == "alert" {
                    presentationOptions = [presentationOptions, .alert]
                }
            }
            
            if option == "badge" {
                presentationOptions = [presentationOptions, .badge]
            }
            
            if option == "sound" {
                presentationOptions = [presentationOptions, .sound]
            }
        }
        
        Notificare.shared.push().presentationOptions = presentationOptions
        resolve(nil)
    }
    
    @objc
    func hasRemoteNotificationsEnabled(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.push().hasRemoteNotificationsEnabled)
    }
    
    @objc
    func allowedUI(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.push().allowedUI)
    }
    
    @objc
    func enableRemoteNotifications(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            Notificare.shared.push().enableRemoteNotifications { result in
                switch result {
                case .success:
                    resolve(nil)
                case let .failure(error):
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            }
        }
    }
    
    @objc
    func disableRemoteNotifications(_ resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            Notificare.shared.push().disableRemoteNotifications()
            resolve(nil)
        }
    }
}

extension NotificarePushModule: NotificarePushDelegate {
    func notificare(_ notificarePush: NotificarePush, didReceiveNotification notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.notification_received", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.notification_received event.", error: error)
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didReceiveSystemNotification notification: NotificareSystemNotification) {
        do {
            dispatchEvent("re.notifica.push.system_notification_received", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.system_notification_received event.", error: error)
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didReceiveUnknownNotification userInfo: [AnyHashable : Any]) {
        dispatchEvent("re.notifica.push.unknown_notification_received", payload: userInfo)
    }
    
    func notificare(_ notificarePush: NotificarePush, didOpenNotification notification: NotificareNotification) {
        do {
            dispatchEvent("re.notifica.push.notification_opened", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.notification_opened event.", error: error)
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didOpenUnknownNotification userInfo: [AnyHashable : Any]) {
        dispatchEvent("re.notifica.push.unknown_notification_opened", payload: userInfo)
    }
    
    func notificare(_ notificarePush: NotificarePush, didOpenAction action: NotificareNotification.Action, for notification: NotificareNotification) {
        do {
            let payload = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ]
            
            dispatchEvent("re.notifica.push.notification_action_opened", payload: payload)
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.notification_action_opened event.", error: error)
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didOpenUnknownAction action: String, for notification: [AnyHashable : Any], responseText: String?) {
        var payload: [String: Any] = [
            "notification": notification,
            "action": action,
        ]
        
        if let responseText = responseText {
            payload["responseText"] = responseText
        }
        
        dispatchEvent("re.notifica.push.unknown_notification_action_opened", payload: payload)
    }
    
    func notificare(_ notificarePush: NotificarePush, didChangeNotificationSettings granted: Bool) {
        dispatchEvent("re.notifica.push.notification_settings_changed", payload: granted)
    }
    
    func notificare(_ notificarePush: NotificarePush, shouldOpenSettings notification: NotificareNotification?) {
        do {
            dispatchEvent("re.notifica.push.should_open_notification_settings", payload: try notification?.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.push.should_open_notification_settings event.", error: error)
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        dispatchEvent("re.notifica.push.failed_to_register_for_remote_notifications", payload: error.localizedDescription)
    }
}
