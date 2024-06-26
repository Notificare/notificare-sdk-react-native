import React
import NotificareKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc public protocol NotificareModuleDelegate {
    func broadcastEvent(name: String, body: Any?)
}

@objc(NotificarePlugin)
public class NotificarePlugin: NSObject {
    @objc public static let shared = NotificarePlugin()
    @objc public weak var delegate: NotificareModuleDelegate? = nil

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    override public init() {
        super.init()

        Notificare.shared.delegate = self

        _ = NotificareSwizzler.addInterceptor(self)
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
            "re.notifica.ready",
            "re.notifica.unlaunched",
            "re.notifica.device_registered",
            "re.notifica.url_opened",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            delegate?.broadcastEvent(name: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    // MARK: - Notificare

    @objc
    public func isConfigured(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.isConfigured)
    }

    @objc
    public func isReady(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.isReady)
    }

    @objc
    public func launch(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.launch { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func unlaunch(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.unlaunch { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func getApplication(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let json = try Notificare.shared.application?.toJson()
            resolve(json)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    public func fetchApplication(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.fetchApplication { result in
            switch result {
            case let .success(application):
                do {
                    let json = try application.toJson()
                    resolve(json)
                } catch {
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func fetchNotification(_ notificationId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.fetchNotification(notificationId) { result in
            switch result {
            case let .success(notification):
                do {
                    let json = try notification.toJson()
                    resolve(json)
                } catch {
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func fetchDynamicLink(_ url: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.fetchDynamicLink(url) { result in
            switch result {
            case let .success(dynamicLink):
                do {
                    let json = try dynamicLink.toJson()
                    resolve(json)
                } catch {
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func canEvaluateDeferredLink(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.canEvaluateDeferredLink)
    }

    @objc
    public func evaluateDeferredLink(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.evaluateDeferredLink { result in
            switch result {
            case let .success(evaluated):
                resolve(evaluated)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    // MARK: - Notificare device module

    @objc
    public func getCurrentDevice(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let json = try Notificare.shared.device().currentDevice?.toJson()
            resolve(json)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    public func getPreferredLanguage(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.device().preferredLanguage)
    }

    @objc
    public func updatePreferredLanguage(_ language: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().updatePreferredLanguage(language) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func registerUser(_ userId: String?, userName: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().register(userId: userId, userName: userName) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func updateUser(_ userId: String?, userName: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().updateUser(userId: userId, userName: userName) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func fetchTags(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().fetchTags { result in
            switch result {
            case let .success(tags):
                resolve(tags)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func addTag(_ tag: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().addTag(tag) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func addTags(_ tags: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().addTags(tags) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func removeTag(_ tag: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().removeTag(tag) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func removeTags(_ tags: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().removeTags(tags) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func clearTags(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().clearTags { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func fetchDoNotDisturb(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().fetchDoNotDisturb { result in
            switch result {
            case let .success(dnd):
                do {
                    let json = try dnd?.toJson()
                    resolve(json)
                } catch {
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func updateDoNotDisturb(_ payload: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let dnd: NotificareDoNotDisturb

        do {
            dnd = try NotificareDoNotDisturb.fromJson(json: payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Notificare.shared.device().updateDoNotDisturb(dnd) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func clearDoNotDisturb(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().clearDoNotDisturb { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func fetchUserData(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().fetchUserData { result in
            switch result {
            case let .success(userData):
                resolve(userData)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func updateUserData(_ userData: [String: String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.device().updateUserData(userData) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    // MARK: - Notificare events module

    @objc
    public func logCustom(_ event: String, data: [String: Any]?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.events().logCustom(event, data: data) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
}

extension NotificarePlugin: NotificareDelegate {
    public func notificare(_ notificare: Notificare, onReady application: NotificareApplication) {
        do {
            dispatchEvent("re.notifica.ready", payload: try application.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.ready event.", error: error)
        }
    }

    public func notificareDidUnlaunch(_ notificare: Notificare) {
        dispatchEvent("re.notifica.unlaunched", payload: nil)
    }

    public func notificare(_ notificare: Notificare, didRegisterDevice device: NotificareDevice) {
        do {
            dispatchEvent("re.notifica.device_registered", payload: try device.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.device_registered event.", error: error)
        }
    }
}

extension NotificarePlugin: NotificareAppDelegateInterceptor {
    public func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any]) -> Bool {
        if Notificare.shared.handleTestDeviceUrl(url) {
            return true
        }

        if Notificare.shared.handleDynamicLinkUrl(url) {
            return true
        }

        dispatchEvent("re.notifica.url_opened", payload: url.absoluteString)
        return false
    }

    public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        guard let url = userActivity.webpageURL else {
            return false
        }

        if Notificare.shared.handleTestDeviceUrl(url) {
            return true
        }

        return Notificare.shared.handleDynamicLinkUrl(url)
    }
}

private func onMainThread(_ action: @escaping () -> Void) {
    DispatchQueue.main.async {
        action()
    }
}
