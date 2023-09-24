let PodDefinitionsPlugin = require('../webpackPlugins/PodDefinitionsPlugin');
let BuildCallbackPlugin = require('../webpackPlugins/BuildCallbackPlugin');
let CustomTasksPlugin = require('../webpackPlugins/CustomTasksPlugin');
let ManifestPlugin = require('../webpackPlugins/ManifestPlugin');
let MockEntryPlugin = require('../webpackPlugins/MockEntryPlugin');
let BuildOutputPlugin = require('../webpackPlugins/BuildOutputPlugin');
let WebpackBar = require('webpackbar');

/**
 *
 * @param {import("../Pod")} pod
 */
module.exports = function (pod) {
    // TODO: Remove in Pod 7 -- Here for backwards compat if a plugin requires this file
    pod = pod || global.Pod;

    let plugins = [];

    // If the user didn't declare any JS compilation, we still need to
    // use a temporary script to force a compile. This plugin will
    // handle the process of deleting the compiled script.
    if (!pod.bundlingJavaScript) {
        plugins.push(new MockEntryPlugin(pod));
    }

    // Activate support for Pod_ .env definitions.
    plugins.push(
        new PodDefinitionsPlugin(pod.paths.root('.env'), {
            NODE_ENV: pod.inProduction()
                ? 'production'
                : process.env.NODE_ENV || 'development'
        })
    );

    // Handle the creation of the pod-manifest.json file.
    plugins.push(new ManifestPlugin(pod));

    // Handle all custom, non-webpack tasks.
    plugins.push(new CustomTasksPlugin(pod));

    // Notify the rest of our app when Webpack has finished its build.
    plugins.push(new BuildCallbackPlugin(stats => pod.dispatch('build', stats)));

    // Enable custom output when the Webpack build completes.
    plugins.push(
        new BuildOutputPlugin({
            clearConsole: pod.config.clearConsole,
            showRelated: true
        })
    );

    if (process.env.NODE_ENV !== 'test') {
        plugins.push(new WebpackBar({ name: 'Pod' }));
    }

    return plugins;
};
