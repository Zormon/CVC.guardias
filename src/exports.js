const DEFAULT_CONFIG = {
  logsDir: '/home/cvc/telemetry/apps',
  deployDir: '/home/cvc/deploy',
  server: {
    ip:'127.0.0.1',
    port: 3000,
  },
  media: {
    transitionDuration: 0.6
  },
  window: {
    type: 0,
    posX: 0,
    posY: 0,
    width: 1280,
    height: 720,
    alwaysOnTop: true
  },
  interface: {
    type: 0,
    colors: {
      app: '#FFFFFF',
      main: '#000000',
      secondary: '#739E10'
    }
  },
  guardias: {
    geolocationQRs: true
  }
}

exports.DEFAULT_CONFIG = DEFAULT_CONFIG