import React
import NotificareKit
import NotificareAssetsKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificareAssetsModule)
class NotificareAssetsModule: NSObject {
    
    @objc class func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    func fetch(_ group: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.assets().fetch(group: group) { result in
            switch result {
            case let .success(assets):
                do {
                    let payload = try assets.map { try $0.toJson() }
                    resolve(payload)
                } catch {
                    reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
                }
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
}
