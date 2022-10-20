/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

function extendConf (conf, api) {
  conf.framework = conf.framework || {};
  conf.framework.plugins = conf.framework.plugins || [];
  if (!conf.framework.plugins.includes('Notify')) {
    console.warn(` App • Extension(${api.extId}): Activating framework plugin 'Notify' ; add it to 'framework.plugins' list into your quasar configuration to get rid of this warning.`);
    conf.framework.plugins.push('Notify');
  }

  // register our boot file
  conf.boot.push('~quasar-app-extension-my-open-vdp/src/boot/register.js')

  // make sure app extension files & ui package gets transpiled
  if (api.hasVite !== true) {
    conf.build.transpileDependencies.push(/quasar-app-extension-my-open-vdp[\\/]src/)
  }

  // make sure the stylesheet goes through webpack to avoid SSR issues
  conf.css.push('~quasar-ui-my-open-vdp/dist/style.css')
}

module.exports = function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app-*" CLI
  api.compatibleWith('quasar', '^2.0.0')

  if (api.hasVite) {
    api.compatibleWith('@quasar/app-vite', '^1.0.0')
  }
  else if (api.hasWebpack) {
    api.compatibleWith('@quasar/app-webpack', '^3.4.0')
  }

  // Uncomment the line below if you provide a JSON API for your component
  api.registerDescribeApi('VdpForm', '~quasar-ui-my-open-vdp/src/components/VdpForm.json')

  // We extend /quasar.conf.js
  api.extendQuasarConf(extendConf)
}
