import Foundation
import NotificareSDK

@objc(NotificareDeviceManagerReactModule)
class NotificareDeviceManagerReactModule: NSObject {

    @objc
    func getCurrentDevice(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.deviceManager.currentDevice?.toDictionary())
    }

    @objc
    func register(_ userId: String?, userName: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.register(userId: userId, userName: userName) { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func getPreferredLanguage(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolve(Notificare.shared.deviceManager.preferredLanguage)
    }

    @objc
    func updatePreferredLanguage(_ language: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.updatePreferredLanguage(language) { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func fetchTags(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.fetchTags { result in
            switch result {
            case .success(let tags):
                resolve(tags)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func addTag(_ tag: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.addTag(tag) { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func addTags(_ tags: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.addTags(tags) { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func removeTag(_ tag: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.removeTag(tag) { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func removeTags(_ tags: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.removeTags(tags) { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func clearTags(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.clearTags { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func fetchDoNotDisturb(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.fetchDoNotDisturb { result in
            switch result {
            case .success(let dnd):
                resolve(dnd?.toDictionary())
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func updateDoNotDisturb(_ dnd: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let parsedDnd: NotificareDoNotDisturb

        do {
            parsedDnd = try NotificareDoNotDisturb(dictionary: dnd)
        } catch {
            reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            return
        }

        Notificare.shared.deviceManager.updateDoNotDisturb(parsedDnd) { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func clearDoNotDisturb(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.clearDoNotDisturb { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func fetchUserData(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.fetchUserData { result in
            switch result {
            case .success(let userData):
                resolve(userData)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }

    @objc
    func updateUserData(_ userData: NotificareUserData, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Notificare.shared.deviceManager.updateUserData(userData) { result in
            switch result {
            case .success:
                resolve(nil)
            case .failure(let error):
                reject(NotificareUtils.DEFAULT_ERROR, error.localizedDescription, error)
            }
        }
    }
}
