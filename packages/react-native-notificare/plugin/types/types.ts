/**
 * Set of properties to implement in app config file (app.json).
 */
export type NotificarePluginProps = {
  /**
   * (required) Set of iOS properties.
   */
  ios: {
    /**
     * (required) Local path to NotificareServices.plist file.
     */
    servicesFile: string;

    /**
     * (optional) NotificareOptions.plist file to customize SDK.
     */
    optionsFile?: string;
  };

  /**
   * (required) Set of Android properties.
   */
  android: {
    /**
     * (required) Local path to notificare-services.json file.
     */
    servicesFile: string;

    /**
     * (optional) Enabled by default. Sends crash reports to our server, accessible in Dashboard > Your App > Events > Application Error.
     */
    crashReportingEnabled?: boolean;

    /**
     * (optional) Enable debug logging for the SDK to aid in development by providing information about SDK behavior and operations. This helps identify and resolve issues.
     */
    debugLoggingEnabled?: boolean;
  };
};
