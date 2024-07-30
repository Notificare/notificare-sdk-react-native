/**
 * Set of properties to implement in app config file (app.json).
 */
export type NotificareScannablesPluginProps = {
  /**
   * (optional) Set of Android properties.
   */
  android?: {
    /**
     * (optional) Custom activity theme that is shown when a scannable session is started. Example: AppTheme.Custom
     */
    customStyle?: string;
  };
};
