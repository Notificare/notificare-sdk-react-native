import React
import NotificareKit
import NotificareGeoKit

private let DEFAULT_ERROR_CODE = "notificare_error"

@objc(NotificareGeoModule)
class NotificareGeoModule: RCTEventEmitter {
    
    private var hasListeners = false
    private var eventQueue = [(name: String, payload: Any?)]()
    
    override init() {
        super.init()
        
        Notificare.shared.geo().delegate = self
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
            "re.notifica.geo.location_updated",
            "re.notifica.geo.region_entered",
            "re.notifica.geo.region_exited",
            "re.notifica.geo.beacon_entered",
            "re.notifica.geo.beacon_exited",
            "re.notifica.geo.beacons_ranged",
            "re.notifica.geo.visit",
            "re.notifica.geo.heading_updated",
        ]
    }
    
    private func dispatchEvent(_ name: String, payload: Any?) {
        if hasListeners {
            sendEvent(withName: name, body: payload)
        } else {
            eventQueue.append((name: name, payload: payload))
        }
    }
    
    // MARK: - Notificare Geo
    
    @objc
    func hasLocationServicesEnabled(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.geo().hasLocationServicesEnabled)
    }
    
    @objc
    func hasBluetoothEnabled(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(Notificare.shared.geo().hasBluetoothEnabled)
    }

    @objc
    func getMonitoredRegions(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let payload = try Notificare.shared.geo().monitoredRegions.map { try $0.toJson() }
            resolve(payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }

    @objc
    func getEnteredRegions(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let payload = try Notificare.shared.geo().enteredRegions.map { try $0.toJson() }
            resolve(payload)
        } catch {
            reject(DEFAULT_ERROR_CODE, error.localizedDescription, nil)
        }
    }
    
    @objc
    func enableLocationUpdates(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        Notificare.shared.geo().enableLocationUpdates()
        resolve(nil)
    }
    
    @objc
    func disableLocationUpdates(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        Notificare.shared.geo().disableLocationUpdates()
        resolve(nil)
    }
}

extension NotificareGeoModule: NotificareGeoDelegate {
    func notificare(_ notificareGeo: NotificareGeo, didUpdateLocations locations: [NotificareLocation]) {
        guard let location = locations.first else { return }
        
        do {
            dispatchEvent("re.notifica.geo.location_updated", payload: try location.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.geo.location_updated event.", error: error)
        }
    }
    
    func notificare(_ notificareGeo: NotificareGeo, didEnter region: NotificareRegion) {
        do {
            dispatchEvent("re.notifica.geo.region_entered", payload: try region.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.geo.region_entered event.", error: error)
        }
    }
    
    func notificare(_ notificareGeo: NotificareGeo, didExit region: NotificareRegion) {
        do {
            dispatchEvent("re.notifica.geo.region_exited", payload: try region.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.geo.region_exited event.", error: error)
        }
    }
    
    func notificare(_ notificareGeo: NotificareGeo, didEnter beacon: NotificareBeacon) {
        do {
            dispatchEvent("re.notifica.geo.beacon_entered", payload: try beacon.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.geo.beacon_entered event.", error: error)
        }
    }
    
    func notificare(_ notificareGeo: NotificareGeo, didExit beacon: NotificareBeacon) {
        do {
            dispatchEvent("re.notifica.geo.beacon_exited", payload: try beacon.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.geo.beacon_exited event.", error: error)
        }
    }
    
    func notificare(_ notificareGeo: NotificareGeo, didRange beacons: [NotificareBeacon], in region: NotificareRegion) {
        do {
            let payload: [String: Any] = [
                "region": try region.toJson(),
                "beacons": try beacons.map { try $0.toJson() },
            ]
            
            dispatchEvent("re.notifica.geo.beacons_ranged", payload: payload)
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.geo.beacons_ranged event.", error: error)
        }
    }
    
    func notificare(_ notificareGeo: NotificareGeo, didVisit visit: NotificareVisit) {
        do {
            dispatchEvent("re.notifica.geo.visit", payload: try visit.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.geo.visit event.", error: error)
        }
    }
    
    func notificare(_ notificareGeo: NotificareGeo, didUpdateHeading heading: NotificareHeading) {
        do {
            dispatchEvent("re.notifica.geo.heading_updated", payload: try heading.toJson())
        } catch {
            NotificareLogger.error("Failed to emit the re.notifica.geo.heading_updated event.", error: error)
        }
    }
}
