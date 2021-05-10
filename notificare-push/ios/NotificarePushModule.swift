import React
import NotificareKit
import NotificarePushKit

fileprivate let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificarePushModule)
class NotificarePushModule: RCTEventEmitter {
    
    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()
    
    override init() {
        super.init()
        
        NotificarePush.shared.delegate = self
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
            "notification_received",
            "system_notification_received",
            "unknown_notification_received",
            "notification_opened",
            "notification_action_opened",
            "notification_settings_changed",
            "should_open_notification_settings",
            "failed_to_register_for_remote_notifications",
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
        
        NotificarePush.shared.authorizationOptions = authorizationOptions
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
        
        NotificarePush.shared.categoryOptions = categoryOptions
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
        
        NotificarePush.shared.presentationOptions = presentationOptions
        resolve(nil)
    }
    
    @objc
    func isRemoteNotificationsEnabled(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(NotificarePush.shared.isRemoteNotificationsEnabled)
    }
    
    @objc
    func enableRemoteNotifications(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        NotificarePush.shared.enableRemoteNotifications { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func disableRemoteNotifications(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        NotificarePush.shared.disableRemoteNotifications()
        resolve(nil)
    }
}

extension NotificarePushModule: NotificarePushDelegate {
    func notificare(_ notificarePush: NotificarePush, didReceiveNotification notification: NotificareNotification) {
        do {
            dispatchEvent("notification_received", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the notification_received event.\n\(error)")
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didReceiveSystemNotification notification: NotificareSystemNotification) {
        do {
            dispatchEvent("system_notification_received", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the system_notification_received event.\n\(error)")
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didReceiveUnknownNotification userInfo: [AnyHashable : Any]) {
        dispatchEvent("unknown_notification_received", payload: userInfo)
    }
    
    func notificare(_ notificarePush: NotificarePush, didOpenNotification notification: NotificareNotification) {
        do {
            dispatchEvent("notification_opened", payload: try notification.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the notification_opened event.\n\(error)")
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didOpenAction action: NotificareNotification.Action, for notification: NotificareNotification) {
        do {
            let payload = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ]
            
            dispatchEvent("notification_action_opened", payload: payload)
        } catch {
            NotificareLogger.error("Failed to emit the notification_action_opened event.\n\(error)")
        }
    }
    
//    func notificare(_ notificarePush: NotificarePush, didReceiveUnknownAction action: String, for notification: [AnyHashable : Any], responseText: String?) {
//
//    }
    
    func notificare(_ notificarePush: NotificarePush, didChangeNotificationSettings granted: Bool) {
        dispatchEvent("notification_settings_changed", payload: granted)
    }
    
    func notificare(_ notificarePush: NotificarePush, shouldOpenSettings notification: NotificareNotification?) {
        do {
            dispatchEvent("should_open_notification_settings", payload: try notification?.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the should_open_notification_settings event.\n\(error)")
        }
    }
    
    func notificare(_ notificarePush: NotificarePush, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        dispatchEvent("failed_to_register_for_remote_notifications", payload: error.localizedDescription)
    }
}
