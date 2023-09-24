let path = require('path');
let TerserPlugin = require('terser-webpack-plugin');

/**
 *
 * @param {import("../Pod")} pod
 * @returns {import("webpack").Configuration & {devServer?: import("webpack").WebpackOptionsNormalized["devServer"]}}
 */
module.exports = function (pod) {
    // TODO: Remove in Pod 7 -- Here for backwards compat if a plugin requires this file
    pod = pod || global.Pod;

    return {
        context: pod.paths.root(),

        mode: pod.inProduction() ? 'production' : 'development',

        infrastructureLogging: pod.isWatching() ? { level: 'none' } : {},

        entry: {},

        output: {
            assetModuleFilename: '[name][ext]?[hash]',
            chunkFilename: '[name].[hash:5].js'
        },

        module: { rules: [] },

        plugins: [],

        resolve: {
            extensions: ['*', '.wasm', '.mjs', '.js', '.jsx', '.json'],
            roots: [path.resolve(pod.config.publicPath)]
        },

        stats: {
            preset: 'errors-warnings',
            performance: pod.inProduction()
        },

        performance: {
            hints: false
        },

        optimization: pod.inProduction()
            ? {
                  providedExports: true,
                  sideEffects: true,
                  usedExports: true,
                  // @ts-ignore
                  minimizer: [new TerserPlugin(pod.config.terser)]
              }
            : {},

        devtool: pod.config.sourcemaps,

        // @ts-ignore
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            static: path.resolve(pod.config.publicPath),
            historyApiFallback: true,
            compress: true,
            allowedHosts: 'all'
        },

        watchOptions: {
            ignored: /node_modules/
        }
    };
};
