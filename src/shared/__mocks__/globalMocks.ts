if (typeof jest !== 'undefined') {
  // only for jest
  global.console = require('console-browserify');
} else {
  // Polyfills for dev/prod
  if (typeof global.console === 'undefined') {
    global.console = {
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {},
      trace: () => {},
      debug: () => {},
      table: () => {},
      group: () => {},
      groupCollapsed: () => {},
      groupEnd: () => {},
      dir: () => {},
      dirxml: () => {},
      time: () => {},
      timeLog: () => {},
      timeEnd: () => {},
      assert: () => {},
      clear: () => {},
      count: () => {},
      countReset: () => {},
      profile: () => {},
      profileEnd: () => {},
      timeStamp: () => {},
    } as unknown as Console;
  }
}
