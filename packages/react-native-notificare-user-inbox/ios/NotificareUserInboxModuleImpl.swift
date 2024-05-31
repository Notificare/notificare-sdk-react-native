import React
import NotificareKit
import NotificareUserInboxKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificareUserInboxModuleImpl)
public class NotificareUserInboxModuleImpl: NSObject {

    @objc
    public func parseResponseFromJson(_ json: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let response = try Notificare.shared.userInbox().parseResponse(json: json)

            let payload = try response.toJson()
            resolve(payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    public func parseResponseFromString(_ json: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let response = try Notificare.shared.userInbox().parseResponse(string: json)

            let payload = try response.toJson()
            resolve(payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    public func open(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: NotificareUserInboxItem

        do {
            item = try NotificareUserInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Notificare.shared.userInbox().open(item) { result in
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
    public func markAsRead(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: NotificareUserInboxItem

        do {
            item = try NotificareUserInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Notificare.shared.userInbox().markAsRead(item) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }

    @objc
    public func remove(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let item: NotificareUserInboxItem

        do {
            item = try NotificareUserInboxItem.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        Notificare.shared.userInbox().remove(item) { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
}
