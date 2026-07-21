declare module 'react-gtm-module' {
  interface GTMInitializeParams {
    gtmId: string
    events?: Record<string, unknown>
    dataLayer?: Record<string, unknown>
    dataLayerName?: string
    auth?: string
    preview?: string
  }

  interface GTMDataLayerParams {
    dataLayer: Record<string, unknown>
    dataLayerName?: string
  }

  const TagManager: {
    initialize(params: GTMInitializeParams): void
    dataLayer(params: GTMDataLayerParams): void
  }

  export default TagManager
}
