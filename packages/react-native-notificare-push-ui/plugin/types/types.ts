/**
 * Set of properties to implement in app config file (app.json).
 */
export type NotificarePushUIPluginProps = {
  /**
   * (optional) Set of iOS properties.
   */
  ios: {
    /**
     * (optional) Localized strings used when presenting notifications.
     * Key corresponds to the language identifier (e.g., 'nl' for Dutch) or default value (e.g., 'default' for Base).
     * Value is the local path to a JSON file containing the localized strings.
     *
     * Note: you must set CFBundleAllowMixedLocalizations to true in infoPlist.
     *
     * Example:
     * {
     *  "default": "./languages/default.json"
     *   "nl": "./languages/dutch.json"
     * }
     *
     * Example file:
     * {
     *   "notificare_ok_button": "Oke"
     * }
     */
    locales?: {
      [key: string]: string;
    };
  };

  /**
   * (optional) Set of Android properties.
   */
  android?: {
    /**
     * (optional) Used by default unless set to FALSE or a custom style is specified. Extends "AppTheme" and ensures floating alerts over your content on an Android app. It also enables the action bar for other types when appropriate.
     */
    useTranslucentStyle?: boolean;

    /**
     * (optional) Theme to be used when presenting notifications. Example: AppTheme.Custom
     */
    customStyle?: string;

    /**
     * (optional) Localized strings used when presenting notifications.
     * Key corresponds to the language identifier (e.g., 'nl' for Dutch) or default value (e.g., 'default').
     * Value is the local path to a JSON file containing the localized strings.
     *
     * Note: you must set CFBundleAllowMixedLocalizations to true in infoPlist.
     *
     * Example:
     * {
     *   "default": "./languages/default.json"
     *   "nl": "./languages/dutch.json"
     * }
     *
     * Example file:
     * {
     *   "notificare_dialog_ok_button": "Oke"
     * }
     */
    locales?: {
      [key: string]: string;
    };
  };
};
