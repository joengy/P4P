const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// zustand publishes two builds behind its package `exports` map: a CommonJS
// one under the `react-native` condition, and an ESM one under `import`.
// The ESM build's devtools middleware reads `import.meta.env`, which Metro's
// web target cannot parse — it throws "Cannot use 'import.meta' outside a
// module" at startup and the whole web app renders a blank page. Metro picks
// the CommonJS build for native but the ESM one for web, so pin zustand to
// the CommonJS build on every platform.
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'zustand' || moduleName.startsWith('zustand/'))) {
    return context.resolveRequest({ ...context, unstable_conditionNames: ['react-native', 'require'] }, moduleName, platform);
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
