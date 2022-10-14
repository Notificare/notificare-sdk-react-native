import React
import NotificareKit
import NotificareScannablesKit
import UIKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificareScannablesModule)
class NotificareScannablesModule: RCTEventEmitter {
    
    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()
    
    private var rootViewController: UIViewController? {
        get {
            UIApplication.shared.delegate?.window??.rootViewController
        }
    }
    
    override init() {
        super.init()
        
        Notificare.shared.scannables().delegate = self
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
            "re.notifica.scannables.scannable_detected",
            "re.notifica.scannables.scannable_session_failed",
        ]
    }
    
    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            sendEvent(withName: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }
    
    // MARK: - Notificare Scannables
    
    @objc
    func canStartNfcScannableSession(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.scannables().canStartNfcScannableSession)
    }
    
    @objc
    func startScannableSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session with a nil root view controller.", nil)
                return
            }
            
            Notificare.shared.scannables().startScannableSession(controller: rootViewController)
            resolve(nil)
        }
    }
    
    @objc
    func startNfcScannableSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            Notificare.shared.scannables().startNfcScannableSession()
            resolve(nil)
        }
    }
    
    @objc
    func startQrCodeScannableSession(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            guard let rootViewController = self.rootViewController else {
                reject(DEFAULT_ERROR_CODE, "Cannot start a scannable session with a nil root view controller.", nil)
                return
            }
            
            Notificare.shared.scannables().startQrCodeScannableSession(controller: rootViewController, modal: true)
            resolve(nil)
        }
    }
    
    @objc
    func fetch(_ tag: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.scannables().fetch(tag: tag) { result in
            switch result {
            case let .success(scannable):
                do {
                    let payload = try scannable.toJson()
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

extension NotificareScannablesModule: NotificareScannablesDelegate {
    func notificare(_ notificareScannables: NotificareScannables, didDetectScannable scannable: NotificareScannable) {
        do {
            dispatchEvent("re.notifica.scannables.scannable_detected", payload: try scannable.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.scannables.scannable_detected event.", error: error)
        }
    }
    
    func notificare(_ notificareScannables: NotificareScannables, didInvalidateScannerSession error: Error) {
        dispatchEvent("re.notifica.scannables.scannable_session_failed", payload: error.localizedDescription)
    }
}
