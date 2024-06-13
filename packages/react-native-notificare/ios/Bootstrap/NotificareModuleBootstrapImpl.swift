import Foundation
import UIKit

@objc(NotificareModuleBootstrapImpl)
public class NotificareModuleBootstrapImpl: NSObject {
    @objc public static func setup() {
        addApplicationLaunchListener()
    }

    private static func addApplicationLaunchListener() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(didFinishLaunching),
            name: UIApplication.didFinishLaunchingNotification,
            object: nil
        )
    }

    private static func removeApplicationLaunchListener() {
        NotificationCenter.default.removeObserver(
            self,
            name: UIApplication.didFinishLaunchingNotification,
            object: nil
        )
    }

    @objc private static func didFinishLaunching() {
        removeApplicationLaunchListener()

        // Force the plugin to load as soon as possible. Otherwise, the interceptor won't
        // be loaded in time to process incoming events on a cold start.
        _ = NotificarePlugin.shared
    }
}
