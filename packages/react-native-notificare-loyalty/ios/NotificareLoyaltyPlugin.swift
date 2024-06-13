import React
import NotificareKit
import NotificareLoyaltyKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificareLoyaltyPlugin)
public class NotificareLoyaltyPlugin: NSObject {

    private var rootViewController: UIViewController? {
        get {
            UIApplication.shared.delegate?.window??.rootViewController
        }
    }

    @objc
    public func fetchPassBySerial(_ serial: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.loyalty().fetchPass(serial: serial) { result in
            switch result {
            case let .success(pass):
                do {
                    let payload = try pass.toJson()
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
    public func fetchPassByBarcode(_ barcode: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.loyalty().fetchPass(barcode: barcode) { result in
            switch result {
            case let .success(pass):
                do {
                    let payload = try pass.toJson()
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
    public func present(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let pass: NotificarePass

        do {
            pass = try NotificarePass.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }

        DispatchQueue.main.async {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot present a pass with a nil root view controller.", nil)
                return
            }

            Notificare.shared.loyalty().present(pass: pass, in: rootViewController)
            resolve(nil)
        }
    }
}
