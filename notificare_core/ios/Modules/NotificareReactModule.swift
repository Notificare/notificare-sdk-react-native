import Foundation
import NotificareSDK

@objc(NotificareReactModule)
class NotificareReactModule: RCTEventEmitter {

    private var hasListeners = false

    override init() {
        super.init()

        Notificare.shared.delegate = self
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    @objc
    override func supportedEvents() -> [String] {
        return [
            "ready",
            "device_registered"
        ]
    }

    @objc
    func getConfigured(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.isConfigured)
    }

    @objc
    func getReady(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.isReady)
    }

    @objc
    func configure(_ applicationKey: String, applicationSecret: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        Notificare.shared.configure(applicationKey: applicationKey, applicationSecret: applicationSecret)
        resolve(nil)
    }

    @objc
    func launch(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        Notificare.shared.launch()
        resolve(nil)
    }

    @objc
    func unlaunch(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        Notificare.shared.unlaunch()
        resolve(nil)
    }
}

extension NotificareReactModule: NotificareDelegate {
    func notificare(_ notificare: Notificare, onReady application: NotificareApplication) {
        self.sendEvent(withName: "ready", body: nil)
    }

    func notificare(_ notificare: Notificare, didRegisterDevice device: NotificareDevice) {
        self.sendEvent(withName: "device_registered", body: device.toDictionary())
    }
}
