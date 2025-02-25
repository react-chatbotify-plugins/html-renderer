/**
 * Specifies the configurations for this example plugin.
 */
export type PluginConfig = {
    autoConfig?: boolean; // defaults to true, helps user to enable the required events
    htmlComponent?: React.ComponentType<{ children: React.ReactNode }>; // if not provided, defaults to using react-html
}