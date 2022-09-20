import React
import NotificareKit
import NotificareMonetizeKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificareMonetizeModule)
class NotificareMonetizeModule: RCTEventEmitter {

    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()

    override init() {
        super.init()

        Notificare.shared.monetize().delegate = self
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
            "re.notifica.monetize.billing_setup_finished",
            "re.notifica.monetize.billing_setup_failed",
            "re.notifica.monetize.products_updated",
            "re.notifica.monetize.purchases_updated",
            "re.notifica.monetize.purchase_finished",
            "re.notifica.monetize.purchase_restored",
            "re.notifica.monetize.purchase_canceled",
            "re.notifica.monetize.purchase_failed",
        ]
    }

    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            sendEvent(withName: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }

    // MARK: - Notificare Monetize

    @objc func getProducts(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let products = try Notificare.shared.monetize().products.map { try $0.toJson() }
            resolve(products)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }
    
    @objc func getPurchases(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let purchases = try Notificare.shared.monetize().purchases.map { try $0.toJson() }
            resolve(purchases)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }
    
    @objc func refresh(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        Notificare.shared.monetize().refresh { result in
            switch result {
            case .success:
                resolve(nil)
            case let .failure(error):
                reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            }
        }
    }
    
    @objc func startPurchaseFlow(_ data: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        let product: NotificareProduct
        
        do {
            product = try NotificareProduct.fromJson(json: data)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
            return
        }
        
        Notificare.shared.monetize().startPurchaseFlow(for: product)
    }
}

extension NotificareMonetizeModule: NotificareMonetizeDelegate {
    func notificare(_ notificareMonetize: NotificareMonetize, didUpdateProducts products: [NotificareProduct]) {
        do {
            dispatchEvent("re.notifica.monetize.products_updated", payload: try products.map { try $0.toJson() })
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.monetize.products_updated event.", error: error)
        }
    }
    
    func notificare(_ notificareMonetize: NotificareMonetize, didUpdatePurchases purchases: [NotificarePurchase]) {
        do {
            dispatchEvent("re.notifica.monetize.purchases_updated", payload: try purchases.map { try $0.toJson() })
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.monetize.purchases_updated event.", error: error)
        }
    }
    
    func notificare(_ notificareMonetize: NotificareMonetize, didFinishPurchase purchase: NotificarePurchase) {
        do {
            dispatchEvent("re.notifica.monetize.purchase_finished", payload: try purchase.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.monetize.purchase_finished event.", error: error)
        }
    }
    
    func notificare(_ notificareMonetize: NotificareMonetize, didRestorePurchase purchase: NotificarePurchase) {
        do {
            dispatchEvent("re.notifica.monetize.purchase_restored", payload: try purchase.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.monetize.purchase_restored event.", error: error)
        }
    }
    
    func notificareDidCancelPurchase(_ notificareMonetize: NotificareMonetize) {
        dispatchEvent("re.notifica.monetize.purchase_canceled", payload: nil)
    }
    
    func notificare(_ notificareMonetize: NotificareMonetize, didFailToPurchase error: Error) {
        dispatchEvent("re.notifica.monetize.purchase_failed", payload: ["errorMessage": error.localizedDescription])
    }
}
