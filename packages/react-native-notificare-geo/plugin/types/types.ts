/**
 * Set of properties to implement in app config file (app.json).
 */
export type NotificareGeoPluginProps = {
  /**
   * (optional) Set of Android properties.
   */
  android?: {
    /**
     * (optional) Number os regions being monitored. The operative system allows a maximum of 100 regions and, we monitor 10 regions by default.
     */
    monitoredRegionsLimit?: number;

    /**
     * (Optional) Beacon support is included by default unless explicitly set to FALSE.
     * This option allows the removal of the beacon library from the build.
     */
    includeBeaconsSupport?: boolean;

    /**
     * (optional) The only way to have your app scan for beacons more often on Android version Oreo and up, is by starting the scan as a foreground service.
     * Foreground services will be shown to the user as an ongoing notification.
     */
    beaconForegroundServiceEnabled?: boolean;

    /**
     * (optional) Local path to an image used as the icon for beacon foreground service notifications. The image should be a 96x96 PNG.
     */
    beaconForegroundServiceSmallIcon?: string;

    /**
     * (optional) Title for beacon foreground service notifications.
     */
    beaconForegroundServiceTitle?: string;

    /**
     * (optional) Message informing the user why the app is scanning for beacons.
     */
    beaconForegroundServiceMessage?: string;

    /**
     * (optional) Show progress bar for beacons foreground service notification.
     */
    beaconForegroundServiceShowProgress?: boolean;
  };
};
