import React
import NotificareKit
import NotificareInboxKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificareInboxModule)
class NotificareInboxModule: RCTEventEmitter {
    
    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()
    
    override init() {
        super.init()
        
        Notificare.shared.inbox().delegate = self
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
            "re.notifica.inbox.inbox_updated",
            "re.notifica.inbox.badge_updated",
        ]
    }
    
    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            sendEvent(withName: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }
    
    // MARK: - Notificare Inbox
    
    @objc
    func getItems(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let payload = try Notificare.shared.inbox().items.map { try $0.toJson() }
            resolve(payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }
    
    @objc
    func getBadge(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.inbox().badge)
    }
    
    @objc
    func refresh(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.inbox().refresh()
        resolve(nil)
    }
    
    @objc
    func open(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: NotificareInboxItem
        
        do {
            item = try NotificareInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        Notificare.shared.inbox().open(item) { result in
            switch result {
            case let .success(notification):
                do {
                    let payload = try notification.toJson()
                    resolve(payload)
                } catch {
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func markAsRead(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: NotificareInboxItem
        
        do {
            item = try NotificareInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        Notificare.shared.inbox().markAsRead(item) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func markAllAsRead(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.inbox().markAllAsRead { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func remove(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: NotificareInboxItem
        
        do {
            item = try NotificareInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        Notificare.shared.inbox().remove(item) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func clear(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.inbox().clear { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
}

extension NotificareInboxModule: NotificareInboxDelegate {
    func notificare(_ notificareInbox: NotificareInbox, didUpdateInbox items: [NotificareInboxItem]) {
        do {
            dispatchEvent("re.notifica.inbox.inbox_updated", payload: try items.map { try $0.toJson() })
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.inbox.inbox_updated event.", error: error)
        }
    }
    
    func notificare(_ notificareInbox: NotificareInbox, didUpdateBadge badge: Int) {
        dispatchEvent("badge_updated", payload: badge)
    }
}
