/**
 * This file represents an example component interface
 * for Pod. All new components can be "inserted" into
 * Pod, like so:
 *
 * // webpack.pod.js
 *
 * pod.extend('foo', new Example());
 *
 * pod.foo();
 */
const { Component } = require('./Component');

module.exports = class Example {
    /**
     * The optional name to be used when called by Pod.
     * Defaults to the class name, lowercased.
     *
     * Ex: pod.example();
     *
     * @return {string|string[]}
     */
    name() {
        // Example:
        // return 'example';
        // return ['example', 'alias'];
    }

    /**
     * All dependencies that should be installed by Pod.
     *
     * @return {string[]}
     */
    dependencies() {
        // Example:
        // return ['typeScript', 'ts'];
    }

    /**
     * Register the component.
     *
     * When your component is called, all user parameters
     * will be passed to this method.
     *
     * Ex: register(src, output) {}
     * Ex: pod.yourPlugin('src/path', 'output/path');
     *
     * @param  {any} ...params
     * @return {void}
     *
     */
    register() {
        // Example:
        // this.config = { proxy: arg };
    }

    /**
     * Boot the component. This method is triggered after the
     * user's webpack.pod.js file has executed.
     */
    boot() {
        // Example:
        // if (this.context.config.foo) {}
    }

    /**
     * Append to the master Pod webpack entry object.
     *
     * @param  {Entry} entry
     * @return {void}
     */
    webpackEntry(entry) {
        // Example:
        // entry.add('foo', 'bar');
    }

    /**
     * Rules to be merged with the master webpack loaders.
     *
     * @return {any[]}
     */
    webpackRules() {
        // Example:
        // return {
        //     test: /\.less$/,
        //     loaders: ['...']
        // });
    }

    /**
     * Plugins to be merged with the master webpack config.
     *
     * @return {any[]}
     */
    webpackPlugins() {
        // Example:
        // return new webpack.ProvidePlugin(this.aliases);
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param  {import("webpack").Configuration} webpackConfig
     * @return {void}
     */
    webpackConfig(webpackConfig) {
        // Example:
        // webpackConfig.resolve.extensions.push('.ts', '.tsx');
    }

    /**
     * Babel config to be merged with Pod's defaults.
     *
     * @return {import("@babel/core").TransformOptions}
     */
    babelConfig() {
        // Example:
        // return { presets: ['@babel/preset-react'] };
    }
};

// Usage:
// pod.extend('example', new Example());
