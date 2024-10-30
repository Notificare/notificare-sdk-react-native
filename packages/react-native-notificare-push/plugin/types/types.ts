/**
 * Set of properties to implement in app config file (app.json).
 */
export type NotificarePushPluginProps = {
  /**
   * (required) Set of iOS properties.
   */
  ios: {
    /**
     * (required) Used to configure APNs environment entitlement. Modes: "development" or "production".
     */
    mode: NotificareApnsEnvironment;

    /**
     * (optional) Use Notificare Notification Service Extension to provide users with rich content in the lock screen such as images.
     */
    useNotificationServiceExtension?: boolean;

    /**
     * (optional) Minimum supported iOS version for Notificare Notification Service Extension. This should match your application deployment target.
     */
    deploymentTarget?: string;
  };

  /**
   * (optional) Set of Android properties.
   */
  android?: {
    /**
     * (optional) Customisations for notification when appears in the status bar or notification drawer.
     */
    notification?: {
      /**
       * (optional) Local path to an image used as the icon for push notifications. The image should be a 96x96 all-white PNG with transparency. App icon is used as default.
       */
      smallIcon?: string;

      /**
       * (optional) Tint applied to notifications small icon when it appears in the notification drawer.
       */
      smallIconAccentColor?: string;
    };

    /**
     * (optional) List of schemes you would like to take a proper action whenever users click in hypertext links in a Notificare's HTML or Web Page notification type.
     * When set, any click on the link in the HTML or Web Page notification type, would be intercepted by our library and trigger the event NotificarePushUI.onNotificationUrlClicked.
     */
    urlSchemes?: string[];
  };
};

export type NotificareApnsEnvironment = 'development' | 'production';
