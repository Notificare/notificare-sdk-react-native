import React
import NotificareKit
import NotificareAuthenticationKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificareAuthenticationModule)
class NotificareAuthenticationModule: RCTEventEmitter {
    
    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()
    
    override init() {
        super.init()
        
        _ = NotificareSwizzler.addInterceptor(self)
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
            "re.notifica.authentication.password_reset_token_received",
            "re.notifica.authentication.validate_user_token_received",
        ]
    }
    
    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            sendEvent(withName: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }
    
    // MARK: - Notificare Authentication
    
    @objc
    func isLoggedIn(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.authentication().isLoggedIn)
    }
    
    @objc
    func login(_ email: String, password: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().login(email: email, password: password) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func logout(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().logout { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func fetchUserDetails(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().fetchUserDetails { result in
            switch result {
            case let .success(user):
                do {
                    let payload = try user.toJson()
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
    func changePassword(_ password: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().changePassword(password) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func generatePushEmailAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().generatePushEmailAddress { result in
            switch result {
            case let .success(user):
                do {
                    let payload = try user.toJson()
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
    func createAccount(_ email: String, password: String, name: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().createAccount(email: email, password: password, name: name) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func validateUser(_ token: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().validateUser(token: token) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func sendPasswordReset(_ email: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().sendPasswordReset(email: email) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func resetPassword(_ password: String, token: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().resetPassword(password, token: token) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func fetchUserPreferences(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().fetchUserPreferences { result in
            switch result {
            case let .success(preferences):
                do {
                    let payload = try preferences.map { try $0.toJson() }
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
    func fetchUserSegments(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.authentication().fetchUserSegments { result in
            switch result {
            case let .success(segments):
                do {
                    let payload = try segments.map { try $0.toJson() }
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
    func addUserSegment(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let segment: NotificareUserSegment
        
        do {
            segment = try NotificareUserSegment.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        Notificare.shared.authentication().addUserSegment(segment) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func removeUserSegment(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let segment: NotificareUserSegment
        
        do {
            segment = try NotificareUserSegment.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        Notificare.shared.authentication().removeUserSegment(segment) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc
    func addUserSegmentToPreference(_ preferenceData: [String: Any], segmentData: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let preference: NotificareUserPreference
        
        do {
            preference = try NotificareUserPreference.fromJson(json: preferenceData)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        do {
            let segment = try NotificareUserSegment.fromJson(json: segmentData)
            Notificare.shared.authentication().addUserSegmentToPreference(segment, to: preference) { result in
                switch result {
                case .success:
                    resolve(nil)
                case let .failure(error):
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            }
            
            return
        } catch {
            NotificareLogger.debug("Failed to parse segment data into NotificareUserSegment.", error: error)
        }
        
        do {
            let option = try NotificareUserPreference.Option.fromJson(json: segmentData)
            Notificare.shared.authentication().addUserSegmentToPreference(option: option, to: preference) { result in
                switch result {
                case .success:
                    resolve(nil)
                case let .failure(error):
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            }
            
            return
        } catch {
            NotificareLogger.debug("Failed to parse segment data into NotificareUserPreference.Option.", error: error)
        }
        
        reject(DEFAULT_ERROR_CODE, "To execute this method, you must provide either a NotificareUserSegment or a NotificarePreferenceOption.", nil)
    }
    
    @objc
    func removeUserSegmentFromPreference(_ preferenceData: [String: Any], segmentData: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let preference: NotificareUserPreference
        
        do {
            preference = try NotificareUserPreference.fromJson(json: preferenceData)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        do {
            let segment = try NotificareUserSegment.fromJson(json: segmentData)
            Notificare.shared.authentication().removeUserSegmentFromPreference(segment, from: preference) { result in
                switch result {
                case .success:
                    resolve(nil)
                case let .failure(error):
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            }
            
            return
        } catch {
            NotificareLogger.debug("Failed to parse segment data into NotificareUserSegment.", error: error)
        }
        
        do {
            let option = try NotificareUserPreference.Option.fromJson(json: segmentData)
            Notificare.shared.authentication().removeUserSegmentFromPreference(option: option, from: preference) { result in
                switch result {
                case .success:
                    resolve(nil)
                case let .failure(error):
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            }
            
            return
        } catch {
            NotificareLogger.debug("Failed to parse segment data into NotificareUserPreference.Option.", error: error)
        }
        
        reject(DEFAULT_ERROR_CODE, "To execute this method, you must provide either a NotificareUserSegment or a NotificarePreferenceOption.", nil)
    }
}

extension NotificareAuthenticationModule: NotificareAppDelegateInterceptor {
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        guard let url = userActivity.webpageURL else {
            return false
        }
        
        if let token = Notificare.shared.authentication().parsePasswordResetToken(url) {
            dispatchEvent("re.notifica.authentication.password_reset_token_received", payload: token)
            return true
        }
        
        if let token = Notificare.shared.authentication().parseValidateUserToken(url) {
            dispatchEvent("re.notifica.authentication.validate_user_token_received", payload: token)
            return true
        }
        
        return false
    }
}
